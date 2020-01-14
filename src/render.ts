
import * as inquirer from 'inquirer';

import Item from './item';
import Task from './task';

export interface Choice {
  name: string;
  value: string;
  checked: boolean;
  short?: string;
};

class Render {
  
  private _buildBoardSet(items: Task[]): Array<string> {
    let duplicateBoards: Array<string> = [];
    items.forEach( (item) => {
      duplicateBoards = duplicateBoards.concat(item.boards);
    });
    return [...Array.from(new Set(duplicateBoards))]
  }

  private _buildChoice(item: Task): Choice {
    return {
      name: item.description,
      value: item.id,
      checked: item.isComplete,
    }
  }

  private _buildChoiceSet(items: Task[]) {
    const choices: (Choice | inquirer.Separator)[] = [];
    const boards = this._buildBoardSet(items);
    boards.forEach( (board) => {
      choices.push(new inquirer.Separator(`== ${board} ==`));
      let choiceSet = items.filter(item => item.boards.includes(board))
          .map( (item) => this._buildChoice(item) );
      choices.push(...choiceSet);
    });
    return choices;
  }

  private _buildQuestion(name: string, message: string, items: Task[]) {
    return {
      type: 'checkbox',
      name: name,
      message: message,
      choices: this._buildChoiceSet(items),
    };
  }

  async displayByBoard(name: string, items: Task[]) {
    const questions = [this._buildQuestion(name, 'Current Live Tasks', items)];
    const answers = await inquirer.prompt(questions);
    return answers;
  }
}

export default new Render();
