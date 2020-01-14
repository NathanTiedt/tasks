#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { basename, join } from 'path';

export interface StoredItem {
  _isTask: boolean;
  [key: string]: any;
};

export default class Storage {
  
  readonly _subDirs: Array<string>;
  readonly _storageFile: string;
  readonly _tempFile: string;

  constructor() {
    this._storageFile = join(this._mainAppDir, 'storage.json');
    this._tempFile = join(this._mainAppDir, 'temp.json');

    this._ensureDirectories();
  }

  get _mainAppDir(): string {
    const defaultDirectory = join(homedir(), '.tasks');
    return defaultDirectory;
  }

  _ensureDirectories() {
    if (!existsSync(this._mainAppDir)) {
      mkdirSync(this._mainAppDir);
    }
  }

  _getTempFile(filePath) {
    const tempFileName = basename(filePath).split('.').join(`.temp-${new Date().getTime()}`);
    return join(this._mainAppDir, tempFileName); 
  }

  load(): StoredItem[] {
    let data: any = [];
    
    if (existsSync(this._storageFile)) {
      const content = readFileSync(this._storageFile, 'utf8');
      data = JSON.parse(content);
    }

    return data;
  }

  save(data: object): void {
    const json: string = JSON.stringify(data);
    const tempFile = this._getTempFile(this._storageFile);
    writeFileSync(tempFile, json, 'utf8');
    renameSync(tempFile, this._storageFile);
  }

}
