import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CarParkPaginationDto, CreateCarParkDto } from '../dtos/carpark.dto';
import { CarParking } from '../entities/carpark.entity';
import { validate } from 'class-validator';
import { createPaginationObject } from '../../../shared/helper';
import { FreeParkingQueryTypeEnum } from '../enum/free_parking.enum';
@Injectable()
export class CarParkService {
  constructor(
    @InjectRepository(CarParking)
    private readonly carParkRepository: Repository<CarParking>,
    private dataSource: DataSource,
  ) {}

  validateImport = async (
    data: Partial<CreateCarParkDto>,
  ): Promise<[boolean, string]> => {
    const listErr: string[] = [];

    const newInput = Object.assign(new CreateCarParkDto(), data);

    const errorList = await validate(newInput);
    if (errorList.length) {
      errorList.forEach((err) => {
        if (err.constraints) {
          Object.values(err.constraints).map((item) => {
            listErr.push(item);
          });
        }
      });
    }
    return [!listErr.length, listErr.join(', ')];
  };

  processImport = async (data: Partial<CreateCarParkDto>[]) => {
    const queryRunner = this.dataSource.createQueryRunner();
    const errorList = [];
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // process data
      const newCarParks: CarParking[] = [];
      for (let i = 0; i < data.length; i++) {
        const [isValid, err] = await this.validateImport(data[Number(i)]);
        if (!isValid) {
          errorList.push({ rowNumber: data[Number(i)].row, err });
        }
        const { night_parking, gantry_height, car_park_decks, ...rest } =
          data[Number(i)];
        const item: Partial<CarParking> = {
          ...rest,
        };
        item.gantry_height = Number(gantry_height);
        item.car_park_decks = Number(car_park_decks);
        item.night_parking = night_parking === 'YES';
        const itemCreated = this.carParkRepository.create(item);
        newCarParks.push(itemCreated);
      }
      const saveCarPark = await this.carParkRepository.save(newCarParks, {
        chunk: 100,
      });
      await queryRunner.commitTransaction();
      return {
        totalImport: Number(data.length),
        totalImported: Number(saveCarPark.length),
        totalError: Number(errorList.length),
        errorsDetail: errorList,
      };
      // end process
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        totalImport: Number(data.length),
        totalImported: 0,
        totalError: Number(errorList.length),
        errorsDetail: errorList,
      };
    } finally {
      await queryRunner.release();
    }
  };

  pagination = async (data: CarParkPaginationDto) => {
    const {
      limit,
      page,
      freeParking,
      nightParking,
      minHeight,
      maxHeight,
      sort,
    } = data;

    const query = this.dataSource
      .getRepository(CarParking)
      .createQueryBuilder('car_parking')
      .take(limit)
      .skip(limit * (page - 1));

    const andConditions = [];

    if (freeParking) {
      if (freeParking === FreeParkingQueryTypeEnum.YES) {
        andConditions.push('car_parking.free_parking <> :value');
      } else {
        andConditions.push('car_parking.free_parking = :value');
      }
    }

    if (nightParking !== undefined) {
      andConditions.push('car_parking.night_parking = :nightParking');
    }

    if (minHeight !== undefined) {
      andConditions.push('car_parking.gantry_height >= :minHeight');
    }

    if (maxHeight !== undefined) {
      andConditions.push('car_parking.gantry_height <= :maxHeight');
    }

    if (andConditions.length > 0) {
      query.andWhere(andConditions.join(' AND '), {
        value: FreeParkingQueryTypeEnum.NO,
        nightParking: nightParking,
        minHeight: minHeight,
        maxHeight: maxHeight,
      });
    }

    const [items, total] = await query
      .orderBy('car_parking.car_park_no', sort)
      .getManyAndCount();

    return createPaginationObject(items, total, page, limit);
  };

  findByIds(ids: number[]) {
    return this.carParkRepository.find({ where: { id: In(ids) } });
  }
}
