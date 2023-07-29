import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { ngxCsv } from 'ngx-csv';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  animations: [
    trigger('fadeInAnimation', [ // Define fadeInAnimation directly in the component
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideInAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }), // Initial state
        animate('0.3s ease-out', style({ transform: 'translateY(0)', opacity: 1 })), // Final state
      ]),
    ]),
  ],
})
export class TaskListComponent {
  sortBy: string = 'dueDate';

  constructor(private taskService: TaskService) { }

  get sortedTasks() {
    const tasks = this.taskService.getTasks();
    const priorityOrder: { [key: string]: number } = { low: 1, medium: 2, high: 3 };

    return tasks.filter((task: any) => task.status !== 'completed')
      .sort((a: any, b: any) => {
        if (this.sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (this.sortBy === 'priority') {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        } else {
          return a.status.localeCompare(b.status);
        }
      });
  }

  get completedTasks() {
    return this.taskService.getTasksWithHistory().filter((task: any) => task.status === 'completed');
  }

  formatDate(date: string): string {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return formattedDate;
  }

  
  exportToCSV() {
    const tasks = this.taskService.getTasks();
    const options = {
      headers: ['Title', 'Description', 'Due Date', 'Priority', 'Status', 'History'], // Add 'History' header
      showLabels: true,
      useBom: true
    };

    // Format the dates and history before exporting to CSV
    const tasksWithFormattedData = tasks.map((task: any) => {
      const formattedTask = {
        ...task,
        dueDate: this.formatDate(task.dueDate),
        history: this.formatHistory(task.history) // Format the history array
      };
      return formattedTask;
    });

    new ngxCsv(tasksWithFormattedData, 'tasks', options);
  }

  private formatHistory(history: any[]): string {
    return history.map((historyItem: any) => {
      const formattedDate = this.formatDate(historyItem.date);
      return `${formattedDate}: ${historyItem.message}`;
    }).join('\n');
  }

  updateStatus(taskId: number, status: string) {
    this.taskService.updateStatus(taskId, status); // Call the updateStatus method from the TaskService
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
  }
}