import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef, EmbeddedViewRef,
  Injector,
  OnInit, TemplateRef,
  ViewChild
} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Listing} from "../model/listing";
import {NotificationService} from "../service/notification.service";
import {Router} from "@angular/router";
import {MatComponent} from "./mat.component";
import {Lipamdogo} from "../model/lipamdogo";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './lipamdogo.component.html',
  styleUrls: ['./lipamdogo.component.scss']
})
export class LipamdogoComponent implements OnInit {

  user: any;
  itemId: any;
  items: any[] = [];
  navTag: string = 'host';

  bookingDatatable: any;
  row: any;

  closeResult: string = '';

  listing: Listing = { userid: 0, name: "", location: "", category: "", subcategory: "", description: "", cost: 0, images: "" };
  @ViewChild('dataTable', {static: false}) table: ElementRef | undefined;
  @ViewChild('contentApproveSubscription') contentApproveSubscriptionRef!: TemplateRef<any> | undefined;
  @ViewChild('contentRejectSubscription') contentRejectSubscriptionRef!: TemplateRef<any> | undefined;
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
      pageLength: 10, // Specify 2 items per page
      ajax: (dataTablesParameters: any, callback: any) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value || '';
        let start = dataTablesParameters.start;
        let length = dataTablesParameters.length;
        const sort = 'id,desc';

        component.api.getItemsLipaMdogoMdogo(start / length, dataTablesParameters.length, dataTablesParameters.search.value, sort).subscribe(resp => {
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
          data: 'name',
          className: 'text-center'
        },
        {
          title: 'Customer Phone',
          data: 'phone',
          className: 'text-center',
        },
        {
          title: 'Place of work',
          data: 'placeofwork',
          className: 'text-center',
        },
        {
          title: 'Residence',
          data: 'residence',
          className: 'text-center',
        },
        {
          title: 'Referee Phone',
          data: 'refereephone',
          className: 'text-center'
        },
        {
          title: 'Institution',
          data: 'institution',
          className: 'text-center',
        },
        {
          title: 'Status',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            let status = "Pending";
            if (row.status === 2){
              status = "Active";
            } else if (row.status === 3){
              status = "Rejected";
            }
            return status;
          }
        },
        {
          title: '',
          data: null,
          className: '',
          defaultContent: '',
          render: (_data: any, type: any, row: any, meta: any) => {
            let status = row.status;
            let tr = $(`#menu-${row.id}`).closest('tr');
            const _row = this.dataTable.row(tr);
            this.rowIndexMap.set(row.id, tr);
            return `<div id="menu-${row.id}"></div>`;
          },
        }
      ],
      columnDefs: [{
        targets: [8], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }],
      createdRow: (row: Node, data: any) => {
        this.createMenuComponent(row, data);
      }
    });
  }

  private createMenuComponent(row: Node, data: any): void {
    const menuContainer = (row as HTMLElement).querySelector(`#menu-${data.id}`);
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
    let _data = JSON.stringify(row);
    let data = JSON.parse(_data);
    console.log("_data", _data)
    console.log("data", data)
    this.itemId = data['row']['id'];
    console.log("this.itemId", this.itemId)

    if (action=== 'Approve'){
      this.open(this.contentApproveSubscriptionRef, 'md');
    } else if (action=== 'Reject'){
      this.open(this.contentRejectSubscriptionRef, 'md');
    }
  }

  approveRejectSubscription(val: number){
    console.log('--> ',this.itemId)
    this.api.approveRejectSubscription(this.itemId, val)
      .subscribe((data: Lipamdogo) => {
        console.log("ffffff--------",data);
        let message = "Successfully approved subscription";
        if (val == 3){
          message = "Successfully rejected subscription";
        }
        // this.loadingEdit = false;
        this.notifyService.showSuccess(message, "Successful");
        //this.listingDatatable.row(this.rowIndex).data(data).invalidate().draw();
        this.dataTable.ajax.reload(null, false);
        this.modalService.dismissAll();
      }, error => {
        // this.loadingEdit = false;
        console.log("error ", error);
      });
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
