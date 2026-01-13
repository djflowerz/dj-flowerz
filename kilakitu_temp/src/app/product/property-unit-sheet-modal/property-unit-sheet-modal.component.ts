import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from '../../service/api.service';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef
} from "@angular/material/bottom-sheet";
import {NotificationService} from "../../service/notification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PropertyUnit} from "../../model/property-unit";
import {NgForm} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
declare var $: any;
@Component({
  selector: 'app-bottom-sheet-modal',
  templateUrl: './property-unit-sheet-modal.component.html',
  styleUrls: ['./property-unit-sheet-modal.component.scss']
})
export class PropertyUnitSheetModalComponent {
  @ViewChild('paymentContent') public paymentContentModal : TemplateRef<any> | undefined;
  @ViewChild('editPropertyUnitContent') editTemplateRef: TemplateRef<any> | undefined;
  closeResult = '';
  resolve = true;
  propertyUnitImages: any;
  propertyUnitDatatable: any;
  cost: number = 0;
  startdate: string = "";
  enddate: string = "";
  url = "http://165.227.173.143:8085/";
  //url = 'http://localhost:8085/';
  loading: boolean = false;
  propertyName: string = "";
  property: any = {};
  img: any;
  user: any;
  propertyUnit: [] = [];
  propertyData: any;
  editPropertyUnitData: any;
  editPropertyUnitRowIndex: any;

  constructor(private _bottomSheetRef: MatBottomSheetRef<PropertyUnitSheetModalComponent>,
              private api: ApiService, private modalService: NgbModal,
              private _bottomSheet: MatBottomSheet,
              private notifyService: NotificationService, private http: HttpClient,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log("inject0 ---- ", this.user);
    console.log("inject ---- ", data);
    this.propertyData = data;
    this.propertyUnit = data.propertyUnit;
  }

  ngOnInit(): void {
    console.log("hello0", this.propertyData);
    console.log("hello1", this.propertyUnit);
    this.initPropertyUnits(this.propertyUnit);
  }

  addPropertyUnit(content: any) {
    this._bottomSheetRef.dismiss({});
    this.openModal(content);
    let propertyData = this.propertyData;
  }

  submitPropertyUnit(form: NgForm){
    console.log(form.value);

    let propertyfk = this.propertyData.id;
    let name = form.value.name;
    let status = form.value.status;

    this.api.savePropertyUnit(propertyfk, name, status).subscribe(data => {
      // @ts-ignore
      this.propertyUnit.push(data);
      this.modalService.dismissAll();
      const config: MatBottomSheetConfig = {  panelClass: 'full-width',
        data: this.propertyData };
      this._bottomSheet.open(PropertyUnitSheetModalComponent, config);
      this.notifyService.showSuccess("Successfully added property unit","Success");
    }, error => {
      console.log(error);
      this.notifyService.showError(error.error.message,"Ooops");
    });
  }

  editPropertyUnit(form: NgForm){
    console.log(form.value);

    let id = this.editPropertyUnitData['id'];
    let name = form.value.name;
    let status = form.value.status;

    this.api.editPropertyUnit(id, name, status).subscribe(data => {

      this.modalService.dismissAll();
      this.propertyUnitDatatable.row(this.editPropertyUnitRowIndex).data(data).invalidate().draw();
      this.notifyService.showSuccess("Successfully added property unit","Success");
    }, error => {
      console.log(error);
      // this.notifyService.showError("Something went wrong please try again","Ooops");
    });
  }

  initPropertyUnits(data: PropertyUnit[]) {
    console.log("pochazzzooooooopppppp:: {}", data)

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
          title: 'Status',
          data: 'status',
          className: 'text-center'
        },
        {
          title: 'Listing Date',
          data: 'datecreated',
          className: 'text-center'
        },
        {
          title: '',
          data: null,
          className: 'text-center edit',
          defaultContent: '<i style="color: blue; cursor: pointer; align-content: center; text-align: center" class="fa fa-pencil"></>',
          responsivePriority: 1
        },
        {
          title: '',
          data: null,
          className: 'text-center delete',
          defaultContent: '<i style="color: firebrick; cursor: pointer; align-content: center; text-align: center" class="fa fa-trash"></>',
          responsivePriority: 1
        }
      ],
    };

    this.propertyUnitDatatable = $('#dtPropertyUnit').DataTable(dtOptions);
    const scope = this;
    const dtPropertyUnitDiv = '#dtPropertyUnit tbody';

    $(dtPropertyUnitDiv).on('click', 'td.edit', function() {
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.propertyUnitDatatable.row(tr);
      const data = row.data();
      scope.editPropertyUnitData = data;
      scope.editPropertyUnitRowIndex = row;
      scope.openModal(scope.editTemplateRef);
    });

    $(dtPropertyUnitDiv).on('click', 'td.delete', function() {
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.propertyUnitDatatable.row(tr);
      const data = row.data();
      scope.deletePropertyUnit(row, data.id);
    });
  }

  deletePropertyUnit(row: any, id: number){
    console.log(id);
    this.api.deletePropertyUnit(id).subscribe(data => {
      this.notifyService.showSuccess("Successfully deleted unit", "success");
      this.propertyUnitDatatable.row(row).remove().draw();
      console.log("data", data)
    }, error => {
      // this.notifyService.showError("Something went wrong please try again", "Oops");
      console.log("error - ", error);
    });
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

  openModal(content: any) {
    this.modalService.dismissAll();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
}
