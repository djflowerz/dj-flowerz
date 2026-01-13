import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import {BookingComponent} from "./booking.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatComponent} from "./mat.component";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";


@NgModule({
  declarations: [BookingComponent, MatComponent],
  imports: [
    CommonModule,
    BookingRoutingModule,
    MatCardModule,
    FormsModule,
    SharedNavbarModule,
    NgbCarouselModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
  ]
})
export class BookingModule { }
