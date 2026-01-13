import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderlogsRoutingModule } from './orderlogs-routing.module';
import {OrderlogsComponent} from "./orderlogs.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";


@NgModule({
  declarations: [OrderlogsComponent],
    imports: [
        CommonModule,
        OrderlogsRoutingModule,
        MatCardModule,
        FormsModule,
        SharedNavbarModule,
        NgbCarouselModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
    ]
})
export class OrderlogsModule { }
