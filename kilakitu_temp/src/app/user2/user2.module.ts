import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { User2RoutingModule } from './user2-routing.module';
import {User2Component} from "./user2.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";


@NgModule({
  declarations: [User2Component],
  imports: [
    CommonModule,
    User2RoutingModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    SharedNavbarModule,
    NgbCarouselModule,
    MatFormFieldModule,
    MatInputModule,
    GooglePlaceModule,
    NgMultiSelectDropDownModule
  ]
})
export class User2Module { }
