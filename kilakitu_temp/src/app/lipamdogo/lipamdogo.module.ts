import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LipamdogoRoutingModule } from './lipamdogo-routing.module';
import {LipamdogoComponent} from "./lipamdogo.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatComponent} from "./mat.component";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [LipamdogoComponent, MatComponent],
  imports: [
    CommonModule,
    LipamdogoRoutingModule,
    MatCardModule,
    FormsModule,
    SharedNavbarModule,
    NgbCarouselModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ]
})
export class LipamdogoModule { }
