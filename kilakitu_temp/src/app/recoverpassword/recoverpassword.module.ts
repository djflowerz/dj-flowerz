import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoverpasswordRoutingModule } from './recoverpassword-routing.module';
import {RecoverpasswordComponent} from "./recoverpassword.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [RecoverpasswordComponent],
  imports: [
    CommonModule,
    RecoverpasswordRoutingModule,
    MatCardModule,
    FormsModule,
    SharedNavbarModule,
    NgbCarouselModule,
    MatFormFieldModule,
    MatInputModule,
  ]
})
export class RecoverpasswordModule { }
