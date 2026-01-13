import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Listing} from "../model/listing";
import {NotificationService} from "../service/notification.service";
import {Payment} from "../model/payment";
import {Router} from "@angular/router";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  user: any;

  navTag: string = 'host';

  paymentDatatable: any;
  row: any;

  closeResult: string = '';

  listing: Listing = { userid: 0, name: "", location: "", category: "", subcategory: "", description: "", cost: 0, images: "" };

  deleteId: any;

  constructor(private api: ApiService,
              private router: Router,
              private notifyService: NotificationService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    let role = this.user['user']['role'];
    let id = this.user['user']['id'];
    if (role == 'USER'){
      this.findAllPaymentsById(id);
    } else {
      this.findAllPayments();
    }
  }

  ngAfterViewInit(){
    this.initPayments([]);
  }

  findAllPayments(){
    this.api.findAllPayments().subscribe((data: Payment[]) => {
      console.log(data);
      this.paymentDatatable.clear().rows.add(data).draw();
      // this.initPayments(data)
    }, error => {
      console.log("payment1 ", error.status);
      if (error.status == 403){
        this.notifyService.showError("Your session has expired, login to continue", "Session Expired");
        localStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }

  findAllPaymentsById(id: number){
    this.api.findAllPaymentsById(id).subscribe((data: Payment[]) => {
      console.log(data);

      // this.initPayments(data)
      this.paymentDatatable.clear().rows.add(data).draw();
    }, error => {
      console.log("payment0 ", error.status);
      if (error.status == 403){
        this.notifyService.showError("Your session has expired, login to continue", "Session Expired");
        localStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }

  initPayments(data: Payment[]) {
    console.log("pochazzzooooooo505 {}", data)

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
          title: 'Tenant',
          data: 'user.name',
          className: 'text-center'
        },
        {
          title: 'Property',
          data: 'property.title',
          className: 'text-center'
        },
        {
          title: 'Unit',
          data: 'propertyUnit.name',
          className: 'text-center'
        },
        {
          title: 'Payment',
          data: 'paymenttag',
          className: 'text-center'
        },
        {
          title: 'Bill ID',
          data: 'paymentreceipt',
          className: 'text-center'
        },
        {
          title: 'Merchant ID',
          data: 'mpesaexpressmerchantrequestid',
          className: 'text-center'
        },
        {
          title: 'Amount',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return 'Ksh ' + row.mpesaexpressamount;
          }
        },
        {
          title: 'Receipt #',
          data: 'mpesaexpressreceiptnumber',
          className: 'text-center'
        },
        {
          title: 'Status',
          data: 'paymentstatus',
          className: 'text-center'
        },
        {
          title: 'Date',
          data: 'processingdate',
          className: 'text-center'
        },
      ],
    };

    this.paymentDatatable = $('#dtPayment').DataTable(dtOptions);
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
