import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column('varchar', { length: 500 })
    taskName: string;

    @Column('boolean', { default: false })
    done: boolean;
}