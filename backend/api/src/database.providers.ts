import { DataSource } from 'typeorm';
import { Task } from './task/model/task.entity';

export const databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: 'password',
                database: 'challenge',
                entities: [Task],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
