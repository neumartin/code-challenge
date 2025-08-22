import { Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './model/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Optional() @Inject('DATA_SOURCE') private readonly dataSource?: DataSource,
  ) {}

  private get repo(): Repository<Task> {
    if (!this.dataSource) {
      throw new Error('DATA_SOURCE is not available');
    }
    return this.dataSource.getRepository(Task);
  }

  async create(data: Partial<Pick<Task, 'taskName' | 'done'>>): Promise<Task> {
    const entity = this.repo.create({
      taskName: data.taskName ?? '',
      done: data.done ?? false,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(id: number, data: Partial<Pick<Task, 'taskName' | 'done'>>): Promise<Task> {
    const task = await this.findOne(id);
    if (typeof data.taskName !== 'undefined') task.taskName = data.taskName;
    if (typeof data.done !== 'undefined') task.done = data.done;
    return this.repo.save(task);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}
