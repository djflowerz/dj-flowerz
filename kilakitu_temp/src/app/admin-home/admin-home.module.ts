import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminHomeRoutingModule } from './admin-home-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AdminHomeComponent} from "./admin-home.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";


@NgModule({
  declarations: [AdminHomeComponent],
  imports: [
    CommonModule,
    AdminHomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgbCarouselModule,
    MatAutocompleteModule,
    SharedNavbarModule
  ]
})
export class AdminHomeModule { }
