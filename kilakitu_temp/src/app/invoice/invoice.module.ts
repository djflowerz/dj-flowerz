import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import {InvoiceComponent} from "./invoice.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";


@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedNavbarModule,
  ]
})
export class InvoiceModule { }
