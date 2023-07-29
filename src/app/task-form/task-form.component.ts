import { Component } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  newTaskDueDate: string = '';
  newTaskPriority: string = 'low';

  constructor(private taskService: TaskService) { }

  addTask() {
    if (this.newTaskTitle.trim() === '') {
      alert('Title cannot be empty.');
      return;
    }

    const newTask = {
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      dueDate: this.newTaskDueDate,
      priority: this.newTaskPriority
    };

    this.taskService.addTask(newTask);
    this.clearForm();
  }

  clearForm() {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskDueDate = '';
    this.newTaskPriority = 'low';
  }
}