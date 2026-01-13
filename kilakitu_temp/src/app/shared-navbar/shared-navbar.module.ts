import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {MainNavbarComponent} from "../main-navbar/main-navbar.component";
import {FooterComponent} from "../footer/footer.component";
import {FormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {AutoOpenMenuComponent} from "../utils/AutoOpenMenuComponent";


@NgModule({
  declarations: [MainNavbarComponent,FooterComponent, AutoOpenMenuComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MatTabsModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
    ],
  exports:[MainNavbarComponent,FooterComponent]
})
export class SharedNavbarModule { }
