
import Item from './item';

export default class Task extends Item {

  readonly _isTask: boolean;
  private _isComplete: boolean;
  private _inProgress: boolean;
  private _priority: number;
  
  constructor(options: any = {}) {
    super(options);
    this._isTask = true;
    this._isComplete = options._isComplete || false;
    this._inProgress = options._inProgress || false;
    this._priority = options._priority || 1;
  }

  get isTask(): boolean { return this._isTask; }
  get isComplete(): boolean { return this._isComplete; }
  get inProgress(): boolean { return this._inProgress; }
  get priority(): number { return this._priority; }

  set isComplete(value: boolean) {
    if (value == true) {
      this._isComplete = true;
      this._inProgress = false;
      this._updated = new Date().getTime()
    } else {
      this._isComplete = false;
      this._updated = new Date().getTime()
    }
  }

  complete(): void {
    this.isComplete = true;
  }

};
