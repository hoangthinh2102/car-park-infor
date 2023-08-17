import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto, UpdateFavoriteCarParkDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CarParkService } from '../../../modules/car-park/services/carpark.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly carParkService: CarParkService,
  ) {}

  register = async (data: CreateUserDto) => {
    const { password } = data;
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(password, salt);
    const newUser = await this.userRepository.create({ ...data });
    return this.userRepository.save(newUser);
  };

  addCarParkToFavorite = async (id: number, data: UpdateFavoriteCarParkDto) => {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const { car_park_ids } = data;
    const carParks = await this.carParkService.findByIds(car_park_ids);
    if (carParks) {
      user.favorite_car_park = carParks;
    }
    await this.userRepository.save(user);
    return this.findOneById(id);
  };

  findOneById = async (id: number) => {
    return this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favorite_car_park', 'car_parks')
      .where('user.id = :id', { id: id })
      .getOne();
  };
}
