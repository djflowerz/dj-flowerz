import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {MAT_AUTOCOMPLETE_SCROLL_STRATEGY} from "@angular/material/autocomplete";
import {BlockScrollStrategy, Overlay} from "@angular/cdk/overlay";
import {AuthenticationInterceptor} from "./interceptors/authentication.interceptor";
import {AuthorizeGuard} from "./guard/authorize.guard";
import {ApiService} from "./service/api.service";

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  providers: [ApiService, AuthorizeGuard,
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true
    },
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
