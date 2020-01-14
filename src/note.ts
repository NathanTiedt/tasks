
import Item from './item';

export default class Note extends Item {
  
  readonly _isTask: boolean;

  constructor(options: any = {}) {
    super(options);
    this._isTask = false;
  }

  get isTask(): boolean { return this._isTask; }
};
