import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import {ProductComponent} from "./product.component";
import {SharedNavbarModule} from "../shared-navbar/shared-navbar.module";
import {MatCardModule} from "@angular/material/card";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {ListingSheetModalComponent} from "./listing-sheet-modal/listing-sheet-modal.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {EditListingSheetModalComponent} from "./edit-listing-sheet-modal/edit-listing-sheet-modal.component";
import {PropertyUnitSheetModalComponent} from "./property-unit-sheet-modal/property-unit-sheet-modal.component";


@NgModule({
  declarations: [ProductComponent, ListingSheetModalComponent, EditListingSheetModalComponent, PropertyUnitSheetModalComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
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
export class ProductModule { }
