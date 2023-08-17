import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class CarParking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  car_park_no: string;

  @Column()
  address: string;

  @Column()
  x_coord: string;

  @Column()
  y_coord: string;

  @Column()
  car_park_type: string;

  @Column()
  type_of_parking_system: string;

  @Column()
  short_term_parking: string;

  @Column()
  free_parking: string;

  @Column()
  night_parking: boolean;

  @Column()
  car_park_decks: number;

  @Column()
  gantry_height: number;

  @Column()
  car_park_basement: string;

  @ManyToMany(() => User, (user) => user.favorite_car_park)
  users: User[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
