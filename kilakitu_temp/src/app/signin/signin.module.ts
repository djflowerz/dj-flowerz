import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigninRoutingModule } from './signin-routing.module';
import {SigninComponent} from "./signin.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [SigninComponent],
  imports: [
    CommonModule,
    SigninRoutingModule,
    MatCardModule,
    FormsModule,
    SharedNavbarModule,
    NgbCarouselModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class SigninModule { }
