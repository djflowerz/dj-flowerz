import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AppStore, AppState } from './app.store';

@Injectable({ providedIn: 'root' })
export class AppQuery extends Query<AppState> {

  dialogTabIndex = this.select(state => state.dialogTabIndex);

  constructor(protected override store: AppStore) {
    super(store);
  }
}
