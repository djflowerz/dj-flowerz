import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Listing} from "../model/listing";
import {NotificationService} from "../service/notification.service";
import {Payment} from "../model/payment";
import {Booking} from "../model/booking";
import {Router} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Product} from "../model/product";
import {Productcategory} from "../model/productcategory";
import {NgForm} from "@angular/forms";
import {Customer} from "../model/customer";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @ViewChild('contentEdit') contentEditRef: TemplateRef<any> | undefined;
  @ViewChild('deleteCategory') deleteCategory: TemplateRef<any> | undefined;

  user: any;
  tabIndex = 0;
  navTag: string = 'host';
  categoriesDatatable: any;
  categories: Productcategory[] = [];
  category: any;
  productSubcategory: string = '';
  row: any;
  modalReference: any;
  deleteId: any;
  categorystatus: any;
  editId: any;
  rowIndex: any;
  closeResult: string = '';
  loadingCreate: boolean = false;
  loadingEdit: boolean = false;
  loadingDelete: boolean = false;
  deletecategory: string = "lock";
  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.findCategories();
  }

  ngAfterViewInit(){
    this.initCategories([]);
  }
  findCategories(){
    this.api.findAllCategories().subscribe((data: Productcategory[]) => {
      console.log("categories -- ",data);
      this.categories = data;
      this.categoriesDatatable.clear().rows.add(data).draw();
    }, error => {
      console.log("categorieserror", error);
    });
  }

  receiveNavMessage($event: string){
    this.router.navigate(['/']);
  }

  selectedTab(e: MatTabChangeEvent) {

  }

  open2(content: any, size: any){
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, centered: true });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason : any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  initCategories(data: Productcategory[]) {
    console.log("pochazzzooooooo505r {}", data)

    const dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      pageLength: 10,
      scrollX: true,
      order: [[2, 'asc']],
      columns: [
        {
          title: 'Id',
          visible: false,
          data: 'id',
          className: 'text-center'
        },
        {
          title: 'Category',
          data: 'name',
          className: 'text-center'
        },
        {
          title: 'Status',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            let status = 'Active';
            if(row.status !== 1){
              status = "Inactive";
            }
            return status;
          }
        },
        {
          title: 'Subcategories',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            let data = '';
            row.productSubCategories.forEach((x: any) => {
              data += x.name + ", ";
            });
            return data.substring(0, data.length - 2);
          }
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
          //defaultContent: '<i style="color: darkred; cursor: pointer; align-content: center; text-align: center" class="fa fa-trash"></>',
          render: (_data: any, type: any, row: any) => {
            let icon = '<i style="color: red; cursor: pointer; align-content: center; text-align: center" class="fa fa-lock"></>';
            if (row.status !== 1){
              icon = '<i style="color: darkred; cursor: pointer; align-content: center; text-align: center" class="fa fa-unlock"></>';
            }
            return icon;
          },
          responsivePriority: 1
        },
      ],
      columnDefs: [{
        targets: [3,4], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }],
    };

    this.categoriesDatatable = $('#dtCategories').DataTable(dtOptions);
    const scope = this;
    const categoriesDiv = '#dtCategories tbody';
    $(categoriesDiv).on('click', 'td.edit', function() {
      scope.productSubcategory = '';
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.categoriesDatatable.row(tr);
      const data = row.data();
      scope.category = data;
      console.log("cats -- ", data);
      console.log("cats22 -- ", scope.category);
      data.productSubCategories.forEach((x: any) => {
        console.log("hello - ", x);
        scope.productSubcategory += x['name'] + ", ";
      })
      scope.productSubcategory = scope.productSubcategory.substring(0, scope.productSubcategory.length-2);
      console.log("hello404 - ", scope.productSubcategory);
      // @ts-ignore
      scope.row = $(this).parents('tr');
      scope.editId = data['id'];

      data.rowIndex = row;
      scope.rowIndex = row;

      scope.open(scope.contentEditRef, 'md');
    });
    $(categoriesDiv).on('click', 'td.delete', function() {
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.categoriesDatatable.row(tr);
      const data = row.data();

      // @ts-ignore
      scope.row = $(this).parents('tr');
      scope.deleteId = data['id'];
      scope.categorystatus = data['status'];

      data.rowIndex = row;
      scope.rowIndex = row;

      console.log("deleteid-?",scope.categorystatus);

      if (scope.categorystatus === 1){
        scope.categorystatus = 0;
        scope.deletecategory = "demote";
      } else {
        scope.categorystatus = 1;
        scope.deletecategory = "promote";
      }
      scope.open(scope.deleteCategory, 'md');
    });
  }

  addCategory(form: NgForm){
    console.log(form);
    let category = form.value.category;
    let subcategory = form.value.subcategory;

    if (category == '' || subcategory == ''){
      this.notifyService.showError("Please enter all fields", "Enter all fields");
      return;
    }

    this.loadingCreate = true;
    this.api.createCategory(category, subcategory).subscribe(data => {
      this.loadingCreate = false;
      console.log("createCat => ",data);
      this.categoriesDatatable.row.add(data).draw(false);
      this.modalService.dismissAll();
      this.notifyService.showSuccess("Successfully added category","Success");
    }, error => {
      this.loadingCreate = false;
      console.log("createCategory error", error);
      if (error.status === 409){
        this.notifyService.showError(error.error.message,"The category already exists");
        return;
      }

      this.notifyService.showError("Problem adding category","Problem Occurred");
    })
  }
  edit(form: NgForm){
    console.log("2");
    this.loadingDelete = true;
    this.api.editCategory(this.editId, this.productSubcategory).subscribe((data: Productcategory) => {
      console.log(data);
      console.log(data.productSubCategories);
      data.productSubCategories.forEach(x => {
        console.log("ppp111 -> ", x);
      })
      this.loadingDelete = false;
      this.notifyService.showSuccess("Success", "Successfully edited category2");
      //this.categoriesDatatable.row(this.rowIndex).remove().draw();
      //this.categoriesDatatable.row(this.rowIndex).data(data).invalidate().draw();
      this.categoriesDatatable.row.add(data).draw(false);
      this.modalService.dismissAll();
    }, error => {
      console.log("error", error)
     // this.modalService.dismissAll();
      if (error.status === 409){
        this.notifyService.showError(error.error.message,"The subcategory already exists");
        return;
      }

      this.loadingDelete = false;
      this.notifyService.showError("Problem", "Problem editing category");
    });
  }

  deleteCategorySubmit(){
    console.log("2--------------------");
    console.log(this.categorystatus);
    this.loadingDelete = true;

    this.api.deleteCategory(this.deleteId, this.categorystatus).subscribe((data: Productcategory) => {
      console.log(data);
      this.loadingDelete = false;
      this.notifyService.showSuccess("Success", "Successfully "+this.deletecategory+" category");
      //this.categoriesDatatable.row(this.rowIndex).remove().draw();
      this.categoriesDatatable.row(this.rowIndex).data(data).invalidate().draw();
      this.modalService.dismissAll();
    }, error => {
      console.log("error", error)
      this.loadingDelete = false;
      this.notifyService.showError("Problem", "Problem deleting category");
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
}
