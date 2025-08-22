import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Optional } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './model/task.entity';

@Controller('task')
export class TaskController {
  constructor(
    @Optional() private readonly taskService?: TaskService,
  ) {}

  @Post()
  create(@Body() body: Partial<Pick<Task, 'taskName' | 'done'>>): Promise<Task> {
    this.ensureService();
    return this.taskService!.create(body);
  }

  @Get()
  findAll(): Promise<Task[]> {
    this.ensureService();
    return this.taskService!.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    this.ensureService();
    return this.taskService!.findOne(this.parseId(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<Pick<Task, 'taskName' | 'done'>>,
  ): Promise<Task> {
    this.ensureService();
    return this.taskService!.update(this.parseId(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    this.ensureService();
    return this.taskService!.remove(this.parseId(id));
  }

  private parseId(id: string): number {
    const parsed = parseInt(id, 10);
    if (Number.isNaN(parsed)) {
      throw new BadRequestException('Invalid id');
    }
    return parsed;
  }

  private ensureService() {
    if (!this.taskService) {
      throw new Error('TaskService is not available');
    }
  }
}
