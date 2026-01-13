import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef, EmbeddedViewRef,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Listing} from "../model/listing";
import {NotificationService} from "../service/notification.service";
import {Payment} from "../model/payment";
import {Booking} from "../model/booking";
import {Router} from "@angular/router";
import {Order} from "../model/order";
import {MatComponent} from "./mat.component";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  user: any;
  items: any[] = [];
  navTag: string = 'host';

  bookingDatatable: any;
  row: any;

  closeResult: string = '';

  listing: Listing = { userid: 0, name: "", location: "", category: "", subcategory: "", description: "", cost: 0, images: "" };
  @ViewChild('dataTable', {static: false}) table: ElementRef | undefined;
  dataTable: any;
  rowIndexMap = new Map<number, any>();
  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private router: Router,
              private modalService: NgbModal,
              private resolver: ComponentFactoryResolver,
              private injector: Injector,
              private appRef: ApplicationRef,) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    let role = this.user['user']['role'];
    let id = this.user['user']['id'];
    //this.findAllBookings();
  }

  ngAfterViewInit(){
  //  this.initBookings([]);
    this.loadItems()
  }

  loadItems(): void {
    console.log("hooray")
    const component = this;
    // @ts-ignore
    this.dataTable = $(this.table.nativeElement).DataTable({
      serverSide: true,
      processing: true,
      responsive: true,
      destroy: true,
      //retrieve: true,
      scrollX: true,
      searching: true,
      dom: 'frtip',
      buttons: [
        {
          extend: 'pdfHtml5',
          text: 'Generate Report',
          action: function (e: any, dt: any, button: any, config: any) {
            // Custom processing logic here
            console.log('Custom PDF button clicked');
            const data = dt.rows({ search: 'applied' }).data().toArray();
            console.log('Data to be processed:', data);
          }
        }
      ],
      pageLength: 7, // Specify 2 items per page
      ajax: (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value || '';
        let start = dataTablesParameters.start;
        let length = dataTablesParameters.length;
        const sort = 'id,desc';

        component.api.getItemsOrders(start / length, dataTablesParameters.length, dataTablesParameters.search.value, sort).subscribe(resp => {
          console.log("resp", resp.content);
          this.items = resp.content;
          component.items = resp.content;
          callback({
            recordsTotal: resp.totalElements,
            recordsFiltered: resp.totalElements,
            data: this.items
          });
        });
      },
      columns: [
        {
          title: 'Id',
          visible: false,
          data: 'id',
          className: 'text-center'
        },
        {
          title: 'Customer',
          data: 'user.name',
          className: 'text-center'
        },
        {
          title: 'Product',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            let data = '';
            row.orderDetails.forEach((x: any) => {
              data += x.product.name + ", ";
            });
            return data.substring(0, data.length - 2);
          }
        },
        {
          title: 'Quantities',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            let data = '';
            row.orderDetails.forEach((x: any) => {
              data += x.quantity + ", ";
            });
            return data.substring(0, data.length - 2);
          }
        },
        {
          title: 'Total Cost',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return "Ksh "+row.totalcost;
          }
        },
        {
          title: 'Sale Agent',
          data: 'saleagent',
          className: 'text-center',
        },
        {
          title: 'Offer',
          data: 'offer',
          className: 'text-center',
        },
        {
          title: 'Delivery Address',
          data: 'deliveryaddress',
          className: 'text-center',
        },
        {
          title: 'Order Date',
          data: 'orderdate',
          className: 'text-center'
        },
        {
          title: 'Status',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return row.status == 4 ? "Payment successful" : "Pending Payment";
          }
        },
        /*{
          title: '',
          data: null,
          className: '',
          defaultContent: '',
          render: (_data: any, type: any, row: any, meta: any) => {
            let status = row.status;
            let tr = $(`#menu-${row.id}`).closest('tr');
            const _row = this.dataTable.row(tr);
            this.rowIndexMap.set(row.id, tr);
            return `<div id="menuclaim-${row.id}"></div>`;
          },
        }*/
      ],
      columnDefs: [{
        targets: [6], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }],
      createdRow: (row: Node, data: any) => {
        this.createMenuComponent(row, data);
      }
    });
  }

  private createMenuComponent(row: Node, data: any): void {
    const menuContainer = (row as HTMLElement).querySelector(`#menuclaim-${data.id}`);
    if (menuContainer) {
      const factory = this.resolver.resolveComponentFactory(MatComponent);
      const componentRef = factory.create(this.injector);
      componentRef.instance.row = data;

      // Listen for the actionSelectedEvent
      componentRef.instance.actionSelectedEvent.subscribe((event: { action: string, id: number }) => {
        this.handleActionSelected(event.action, event, event.id);
      });

      this.appRef.attachView(componentRef.hostView);
      const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
      menuContainer.appendChild(domElem);
    }
  }

  handleActionSelected(action: string, row: any, id: number): void {
    console.log(`Action '${action}' received for ID ${id}`);
  }

  findAllBookings(){
    this.api.findAllBookings().subscribe((data: Booking[]) => {
      console.log(data);
      this.bookingDatatable.clear().rows.add(data).draw();
      // this.initBookings(data)
    }, error => {
      console.log("booking0 ",error.status)
      if (error.status == 403){
        this.notifyService.showError("Your session has expired, login to continue", "Session Expired");
        localStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }

  initBookings(data: Order[]) {

    const dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      pageLength: 10,
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
          title: 'Customer',
          data: 'user.name',
          className: 'text-center'
        },
        {
          title: 'Product',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            let data = '';
            row.orderDetails.forEach((x: any) => {
              data += x.product.name + ", ";
            });
            return data.substring(0, data.length - 2);
          }
        },
        {
          title: 'Total Cost',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return "Ksh "+row.totalcost;
          }
        },
        {
          title: 'Sale Agent',
          data: 'saleagent',
          className: 'text-center',
        },
        {
          title: 'Order Date',
          data: 'orderdate',
          className: 'text-center'
        },
        {
          title: 'Status',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {

            return row.status == 4 ? "Payment successful" : "Pending Payment";
          }
        },
      ],
    };

    this.bookingDatatable = $('#dtOrders  ').DataTable(dtOptions);
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
