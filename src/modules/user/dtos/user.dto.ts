import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UserDto {
  @ApiProperty({})
  first_name: string;

  @ApiProperty({})
  last_name: string;

  @ApiProperty({})
  email: string;

  @ApiProperty({})
  password: string;
}

export class CreateUserDto extends UserDto {}

export class UpdateFavoriteCarParkDto {
  @ApiProperty({})
  @IsArray()
  car_park_ids: number[];
}
