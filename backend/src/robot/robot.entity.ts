import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class RobotPosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  facing: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  timestamp: Date;
}
