import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {UserComponent} from "./user.component";
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
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
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
export class UserModule { }
