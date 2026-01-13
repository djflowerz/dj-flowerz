import {Component, EventEmitter, Input, Output} from '@angular/core';
@Component({
  selector: 'app-mat-claim-menu',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menuclaim">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menuclaim="matMenu" >
      <button mat-menu-item (click)="actionSelected('Edit', row, row.id)">Edit</button>
      <button mat-menu-item (click)="actionSelected('Update',row, row.id)">Update</button>
      <button mat-menu-item (click)="actionSelected('Claim Form',row,row.id)">Claim Form</button>
      <button mat-menu-item (click)="actionSelected('Assessors Report',row,row.id)">Assessors Report</button>
      <button mat-menu-item (click)="actionSelected('Claim Fee Note',row,row.id)">Claim Fee Note</button>
      <button mat-menu-item (click)="actionSelected('Adjustors Report',row,row.id)">Adjustors Report</button>
      <button mat-menu-item (click)="actionSelected('Legal Fees',row,row.id)">Legal Fees</button>
      <button mat-menu-item (click)="actionSelected('Judgement',row,row.id)">Judgement</button>
      <button mat-menu-item (click)="actionSelected('Salvage Receipt',row,row.id)">Salvage Receipt</button>
      <button mat-menu-item (click)="actionSelected('Claims Notification',row,row.id)">Claims Notification</button>
      <button mat-menu-item (click)="actionSelected('Discharge Voucher',row,row.id)">Discharge Voucher</button>
    </mat-menu>
  `
})
export class MatComponent {
  @Input() row: any;
  @Output() actionSelectedEvent = new EventEmitter<{action: string, row: any, id: number}>();

  constructor() {}

  actionSelected(action: string, row: any, id: number): void {
    console.log(`Action '${action}' selected for ID ${id} and row '${row}'`);
    // Implement your action logic here
    this.actionSelectedEvent.emit({ action, row, id });
  }
}
