import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LipamdogoComponent} from "./lipamdogo.component";

const routes: Routes = [{
  path: "",
  component: LipamdogoComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LipamdogoRoutingModule { }
