/* eslint-disable @typescript-eslint/no-var-requires */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CarParking } from './modules/car-park/entities/carpark.entity';
import { User } from './modules/user/entities/user.entity';
require('dotenv').config();

const url = process.env.DATABASE_PATH;

const connectionInfo = {
  database: url,
};

export const typeORMConfig: TypeOrmModuleOptions = {
  ...connectionInfo,
  ...{
    type: 'sqlite',
    synchronize: true,
    entities: [CarParking, User],
    useUTC: true,
    connectTimeoutMS: 10000,
    maxQueryExecutionTime: 5000,
    logNotifications: true,
  },
};
