import { Component } from '@angular/core';
import { TaskService } from '../task.service';
import { trigger, transition, style, animate } from '@angular/animations'; // Import the animation functions

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.css'],
  animations: [
    trigger('slideInAnimation', [ // Define slideInAnimation directly in the component
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('0.3s ease', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class TaskHistoryComponent {
  constructor(public taskService: TaskService) { }

  get tasksWithHistory() {
    const tasks = this.taskService.getTasksWithHistory();
    return tasks.map((task: any) => {
      const history = [...task.history].reverse(); // Reverse the history array
      return { ...task, history };
    });
  }
  clearAllTasks() {
    this.taskService.clearAllTasks();
  }
}