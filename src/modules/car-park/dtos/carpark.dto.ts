import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SortDirection } from '../../../shared/common.enum';
import { FreeParkingQueryTypeEnum } from '../enum/free_parking.enum';
import { NightParkingEnum } from '../enum/night_parking.enum';

export class CreateCarParkDto {
  @ApiProperty({})
  car_park_no: string;

  @ApiProperty({})
  address: string;

  @ApiProperty({})
  x_coord: string;

  @ApiProperty({})
  y_coord: string;

  @ApiProperty({})
  car_park_type: string;

  @ApiProperty({})
  type_of_parking_system: string;

  @ApiProperty({})
  short_term_parking: string;

  @ApiProperty({})
  free_parking: string;

  @ApiProperty({})
  night_parking: string;

  @ApiProperty({})
  car_park_decks: number;

  @ApiProperty({})
  gantry_height: number;

  @ApiProperty({})
  car_park_basement: string;

  row?: number;
}

export class CarParkPaginationDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  searchKey?: string;

  @ApiProperty({
    required: false,
    type: Number,
    example: 1,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    required: false,
    type: Number,
    example: 10,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    required: false,
    type: SortDirection,
    enum: SortDirection,
    description: 'Sort ASC || DESC',
  })
  @IsOptional()
  sort?: SortDirection;

  @ApiProperty({
    required: false,
    type: FreeParkingQueryTypeEnum,
    enum: FreeParkingQueryTypeEnum,
  })
  @IsOptional()
  freeParking?: FreeParkingQueryTypeEnum;

  @ApiProperty({
    required: false,
    type: NightParkingEnum,
    enum: NightParkingEnum,
    description: 'By using sqlite3, 1 mean true, 0 mean false',
  })
  @IsOptional()
  nightParking?: NightParkingEnum;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  minHeight?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  maxHeight?: number;
}
