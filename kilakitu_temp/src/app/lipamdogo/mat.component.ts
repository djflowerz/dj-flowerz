import {Component, EventEmitter, Input, Output} from '@angular/core';
@Component({
  selector: 'app-mat-menu',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu" style="padding: 0 !important; margin: 0 !important; height: 1px !important;">
      <!--      <mat-icon class="small-icon">more_vert</mat-icon>-->
      <h5 style="font-size: 20px; color: black; font-weight: bold; margin-top: -5px; ">...</h5>
    </button>
    <mat-menu #menu="matMenu" style="padding: 0">
      <button mat-menu-item (click)="actionSelected('Approve', row, row.id)">Approve</button>
      <button mat-menu-item (click)="actionSelected('Reject', row, row.id)">Reject</button>
    </mat-menu>
  `
})
export class MatComponent {
  @Input() row: any;
  @Output() actionSelectedEvent = new EventEmitter<{action: string, row: any, id: number}>();
  user: any;
  role: string = '';
  constructor() {
  }

  ngOnInit(): void {
    console.log("row ==== >", this.row)
    this.user = JSON.parse(localStorage.getItem('sca-user') || '{}');
    this.role = this.user['user']['role'];
    let id = this.user['user']['id'];
    console.log("role --", this.role);
  }

  actionSelected(action: string, row: any, id: number): void {
    console.log(`Action '${action}' selected for ID ${id} and row '${row}'`);
    // Implement your action logic here
    this.actionSelectedEvent.emit({ action, row, id });
  }
}
