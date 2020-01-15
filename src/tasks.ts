
import * as uuid4 from 'uuid4';

import Note from './note';
import Render from './render';
import Storage from './storage';
import Task from './task';

import { StoredItem } from './storage';

class Tasks {

  private _storage: Storage; 

  constructor() {
    this._storage = new Storage();
  }

  private get _data(): StoredItem[] {
    return this._storage.load();
  }

  private get _notes(): Array<Note> {
    return this._data.filter(obj => !obj._isTask)
        .map( (obj) => new Note(obj));
  }

  private get _tasks(): Array<Task> {
    return this._data.filter((obj) => obj._isTask)
        .map( (obj) => new Task(obj));
  }

  private _generateId(data: any[] = this._tasks): number {
    const ids = data.map(item => item.displayId);
    const max = (ids.length === 0) ? 0 : Math.max(...ids);
    return max + 1;
  }

  createTask(input) {
    input.displayId = this._generateId();
    const task = new Task(input);
    const tasks = this._tasks;
    tasks.push(task);
    this._storage.save(tasks);
  }

  async checkCompletenessByBoard(): Promise<any> {
    const name = 'completed';
    const completed = await Render.displayByBoard(name, this._tasks);
    this.completeTasks(completed[name]);
  }

  async completeTasks(ids: Array<string>): Promise<any> {
    let tasks = this._tasks;
    tasks = tasks.map(task => {
      task.isComplete = false;
      return task;
    });
    ids.forEach( (id) => {
      const index = tasks.findIndex(task => task.id == id);
      if (index != -1) tasks[index].complete();
    })
    this._storage.save(tasks);
  }

  async displayByBoard(): Promise<any> {
    return Render.displayByBoard('completed', this._tasks);
  }
  
}

export default new Tasks();
