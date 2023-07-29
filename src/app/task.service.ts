import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'tasks';

  constructor() { }

  addTask(newTask: any) {
    const tasks = this.getTasks();
    newTask.id = this.generateTaskId();
    newTask.status = 'to-do';
    newTask.history = [{ date: new Date(), message: 'Task created.' }];

    tasks.push(newTask);
    this.saveTasks(tasks);
  }

  updateTask(taskId: number, updatedTask: any) {
    const tasks = this.getTasks();
    const taskToUpdate = tasks.find((task: any) => task.id === taskId);

    if (taskToUpdate) {
      taskToUpdate.title = updatedTask.title;
      taskToUpdate.description = updatedTask.description;
      taskToUpdate.dueDate = updatedTask.dueDate;
      taskToUpdate.priority = updatedTask.priority;

      taskToUpdate.history.push({ date: new Date(), message: 'Task updated.' });
      this.saveTasks(tasks);
    }
  }

  deleteTask(taskId: number) {
    const tasks = this.getTasks();
    const taskToDelete = tasks.find((task: any) => task.id === taskId);
  
    if (taskToDelete) {
      // Create a history entry for the deletion
      const deletionEntry = { date: new Date(), message: 'Task deleted.' };
      taskToDelete.history.push(deletionEntry);
  
      // Remove the task from the tasks array
      const updatedTasks = tasks.filter((task: any) => task.id !== taskId);
      this.saveTasks(updatedTasks);
    }
  }

  moveTaskToHistory(taskId: number) {
    const tasks = this.getTasks();
    const taskToMove = tasks.find((task: any) => task.id === taskId);

    if (taskToMove) {
      taskToMove.status = 'completed';
      taskToMove.history.push({ date: new Date(), message: `Task marked as completed.` });

      const updatedTasks = tasks.filter((task: any) => task.id !== taskId);
      this.saveTasks(updatedTasks); // Save updated task list without the completed task

      const historyTasks = this.getTasksWithHistory();
      historyTasks.push(taskToMove);
      this.saveTasksWithHistory(historyTasks); // Save the task in the history
    }
  }

  clearTaskHistory() {
    const tasks = this.getTasks();
    const updatedTasks = tasks.map((task: any) => {
      return {
        ...task,
        history: []
      };
    });
    this.saveTasks(updatedTasks);
  }

  clearAllHistory() {
    const tasks = this.getTasks();
    const updatedTasks = tasks.map((task: any) => {
      return {
        ...task,
        history: []
      };
    });
    this.saveTasks(updatedTasks);
  }

  clearAllTasks() {
    const updatedTasks: any = [];
    this.saveTasks(updatedTasks);
  }

  updateStatus(taskId: number, status: string) {
    const tasks = this.getTasks();
    const taskToUpdate = tasks.find((task: any) => task.id === taskId);

    if (taskToUpdate) {
      if (status === 'completed') {
        this.moveTaskToHistory(taskId);
      } else {
        taskToUpdate.status = status;
        taskToUpdate.history.push({ date: new Date(), message: `Task status changed to ${status}.` });
        this.saveTasks(tasks);
      }
    }
  }

  private saveTasksWithHistory(tasks: any[]) {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  getTasks() {
    const tasksJSON = localStorage.getItem(this.TASKS_KEY);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
  }

  getTasksWithHistory() {
    const tasks = this.getTasks();
    return tasks.map((task: any) => {
      const history = [...task.history];
      return { ...task, history };
    });
  }

  private generateTaskId() {
    const tasks = this.getTasks();
    return tasks.length > 0 ? Math.max(...tasks.map((task: any) => task.id)) + 1 : 1;
  }

  saveTasks(tasks: any[]) {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }
}