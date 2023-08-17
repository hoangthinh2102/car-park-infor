import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarParkingController } from './controller/carpark.controller';
import { CarParking } from './entities/carpark.entity';
import { CarParkService } from './services/carpark.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarParking])],
  providers: [CarParkService],
  controllers: [CarParkingController],
  exports: [CarParkService],
})
export class CarParkingModule {}
