import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks: Task[] = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.titlte.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      titlte: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    this.tasks.splice(index, 1);
  }

  updateTask(id: string, status: TaskStatus): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    task.status = status;

    return task;
  }
}
