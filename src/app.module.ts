import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarParkingModule } from './modules/car-park/carpark.module';
import { UsersModule } from './modules/user/user.module';
import { typeORMConfig } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    CarParkingModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
