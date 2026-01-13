import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Listing} from "../model/listing";
import {NotificationService} from "../service/notification.service";
import {Payment} from "../model/payment";
import {Booking} from "../model/booking";
import {Router} from "@angular/router";
import {Order} from "../model/order";
import {Customer} from "../model/customer";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  user: any;

  navTag: string = 'host';

  bookingDatatable: any;
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
    this.findAllCustomers();
    this.initCustomers([]);
  }

  findAllCustomers(){
    this.api.findAllCustomers().subscribe((data: Customer[]) => {
      console.log(data);
      this.bookingDatatable.clear().rows.add(data).draw();
      // this.initBookings(data)
    }, error => {
      console.log("booking0 ",error.status)
      if (error.status == 403){
        this.notifyService.showError("Your session has expired, login to continue", "Session Expired");
      }
    });
  }

  initCustomers(data: Customer[]) {

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
          title: 'Name',
          data: 'name',
          className: 'text-center'
        },
        {
          title: 'Email',
          data: 'email',
          className: 'text-center'
        },
        {
          title: 'Phone',
          data: 'phone',
          className: 'text-center'
        },
        {
          title: 'Date Created',
          data: 'datecreated',
          className: 'text-center'
        },
      ],
    };

    this.bookingDatatable = $('#dtBooking').DataTable(dtOptions);
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
