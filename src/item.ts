
import * as uuid4 from 'uuid4';
const now = new Date();

export default class Item {

  readonly _id: string;
  private _displayId: number;
  readonly _created: number;
  protected _updated: number;
  private _description: string;
  private _starred: boolean;
  private _boards: Array<string>;

  constructor(options: any = {}) {
    this._id = options._id || uuid4();
    this._displayId = options._displayId;
    this._created = options._created || now.getTime();
    this._updated = options._updated || now.getTime();
    this._description = options._description;
    this._starred = options._starred || false;
    this._boards = options._boards || ['general'];
  }

  get id(): string { return this._id; }
  get displayId(): number { return this._displayId; }
  get created(): number { return this._created; }
  get updated(): number { return this._updated; }
  get description(): string { return this._description; }
  get starred(): boolean { return this._starred; }
  get boards(): Array<string> { return this._boards; }

  set displayId(value: number) {
    if (typeof value !== 'number') throw new Error('new display id must be a number');
    if (value <= 0) throw new Error('new display id equal to or less than 0');
    this._displayId = value;
    this._updated = new Date().getTime()
  }
  set description(value: string) {
    if (typeof value !== 'string') throw new Error('new description must be a string');
    if (value.length > 160) throw new Error('new description cant be longer than 160 characters');
    this._description = value;
    this._updated = new Date().getTime()
  }
  set starred(value: boolean) {
    if (typeof value !== 'boolean') throw new Error('starred can only be a boolean');
    this._starred = value;
    this._updated = new Date().getTime()
  }
  set boards(values: Array<string>) {
    values.forEach(value => {
      if (typeof value !== 'string') throw new Error('board must be a string identifier');
    });
    this._boards = values;
    this._updated = new Date().getTime()
  }

  addBoard(board: string) {
    if (typeof board !== 'string') throw new Error('board must be a string identifier');
    this._boards.push(board);
    this._updated = new Date().getTime()
  }

};
