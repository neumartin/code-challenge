import {Module} from '@nestjs/common';
import {TaskService} from './task.service';
import {TaskController} from './task.controller';
import {databaseProviders} from '../database.providers';

@Module({
    providers: [TaskService, ...databaseProviders],
    controllers: [TaskController],
    exports: [...databaseProviders],
})
export class TaskModule {
}
