import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface AppState {
  dialogTabIndex: number;

}

export function createInitialState(): AppState {
  console.log('createInitialState');
  return {
    dialogTabIndex: 0
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'app' })
export class AppStore extends Store<AppState> {

  constructor() {
    super(createInitialState());
  }
}
