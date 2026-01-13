import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderlogsComponent} from "./orderlogs.component";

const routes: Routes = [{
  path: "",
  component: OrderlogsComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderlogsRoutingModule { }
