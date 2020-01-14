
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

  createTask(input) {
    input._boards = input.boards;
    input._description = input.description;
    if (input._boards.length === 0) input._boards = ['general']
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
    const tasks = this._tasks;
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
