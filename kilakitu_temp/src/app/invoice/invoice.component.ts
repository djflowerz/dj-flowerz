import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Listing} from "../model/listing";
import {NotificationService} from "../service/notification.service";
import {Payment} from "../model/payment";
import {Booking} from "../model/booking";
import {Router} from "@angular/router";
declare const $: any;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  user: any;

  navTag: string = 'host';

  invoiceDatatable: any;
  row: any;

  closeResult: string = '';

  listing: Listing = { userid: 0, name: "", location: "", category: "", subcategory: "", description: "", cost: 0, images: "" };

  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    let role = this.user['user']['role'];
    let id = this.user['user']['id'];
  }

  ngAfterViewInit(){
    this.initInvoice([]);
  }

  initInvoice(data: Booking[]) {

    const dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      pageLength: 5,
      scrollX: true,
      order: [[0, 'desc']],
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'pdfHtml5',
          orientation: 'landscape',
          pageSize: 'LEGAL'
        }
      ],
      columns: [
        {
          title: 'Id',
          visible: false,
          data: 'id',
          className: 'text-center'
        },
        {
          title: 'Invoice Number',
          data: 'property.user.name',
          className: 'text-center'
        },

        {
          title: 'Tenant',
          data: 'user.name',
          className: 'text-center'
        },
        {
          title: 'Property',
          data: 'user.name',
          className: 'text-center'
        },
        {
          title: 'Unit',
          data: 'property.title',
          className: 'text-center'
        },
        {
          title: 'Amount',
          data: 'propertyUnit.name',
          className: 'text-center'
        },
        {
          title: 'Status',
          data: 'property.location',
          className: 'text-center'
        },
        {
          title: 'Date',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return 'Ksh ' + row.property.cost;
          }
        },
      ],
    };

    this.invoiceDatatable = $('#dtInvoice').DataTable(dtOptions);
  }

  open(content: any, size: string) {
    console.log(content)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, centered: true }).result.then(
      (result) => {

        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  receiveNavMessage($event: string){
    this.router.navigate(['/']);
  }
}
