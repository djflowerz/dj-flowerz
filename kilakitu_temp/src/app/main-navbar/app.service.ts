import { Injectable, OnDestroy } from '@angular/core';
import { AppQuery } from './app.query';
import {AppStore} from "./app.store";

@Injectable({ providedIn: 'root' })
export class AppService implements OnDestroy {

  constructor(private appStore: AppStore, private query: AppQuery) {
  }

  ngOnDestroy(): void {
  }

  updateTabIndex(index: number) {
    this.appStore.update(state => {
      return {...state, dialogTabIndex: index };
    });
  }
}
