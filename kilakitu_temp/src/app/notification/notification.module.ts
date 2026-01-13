import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import {NotificationComponent} from "./notification.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTabsModule} from "@angular/material/tabs";


@NgModule({
  declarations: [NotificationComponent],
    imports: [
        CommonModule,
        NotificationRoutingModule,
        MatCardModule,
        FormsModule,
        SharedNavbarModule,
        NgbCarouselModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
    ]
})
export class NotificationModule { }
