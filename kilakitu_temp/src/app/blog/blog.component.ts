import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../service/notification.service";
import {Router} from "@angular/router";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Productcategory} from "../model/productcategory";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Blog} from "../model/blog";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  @ViewChild('contentEdit') contentEditRef: TemplateRef<any> | undefined;
  @ViewChild('deleteCategory') deleteCategory: TemplateRef<any> | undefined;
  url: string = "https://kilakitu.co.ke/";
  //url: string = "http://localhost:8085/";
  user: any;
  tabIndex = 0;
  navTag: string = 'host';
  categoriesDatatable: any;
  categories: Productcategory[] = [];
  blogs: Blog[] = [];
  category: any;
  article: any;
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
  articleImg: any;
  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private router: Router,
              private http: HttpClient,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log("user --> ", this.user['user']['name'])
    this.findCategories();
  }

  ngAfterViewInit(){
    this.initCategories([]);
  }
  findCategories(){
    this.api.findAllBlogs().subscribe((data: Blog[]) => {
      console.log("categories -- ",data);
      this.blogs = data;
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

  onChange(file: any, tag: string) {
    console.log(file, tag);
    let photo = file[0]['name'];
    let fileSize = file[0]['size'] / 1000000;
    console.log("fileSize=>", fileSize);
    if (fileSize > 2) {
      this.notifyService.showError("Image too large, maximum image size is 2mb", "Image too large");
      return
    }

    let mimeType = file[0].type;
    console.log("mimeType=>", mimeType);
    if (mimeType.match(/image\/*/) == null) {
      this.notifyService.showError("Only images are supported", "Only Images");
      return;
    }


    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      //this.articleImg = reader.result;
      this.articleImg = file[0];
    }
  }

  upload(form: NgForm) {
    let title = form.value.title;
    let subtitle = form.value.subtitle;
    let description = form.value.description;

    if (title === '' || subtitle == '' || description === ''){
      this.notifyService.showError("Please enter all fields", "Please enter all fields")
      return;
    }

    if (this.articleImg === null || this.articleImg === undefined){
      this.notifyService.showError("Please upload cover image", "Please upload cover image")
      return;
    }

    let uploadData = new FormData();

    uploadData.append('articleimage', this.articleImg);
    uploadData.append('title', title);
    uploadData.append('username', this.user['user']['name']);
    uploadData.append('subtitle', subtitle);
    uploadData.append('description', description);

    console.log("this.articleImg", this.articleImg)
    const options = {
      headers: new HttpHeaders()
        .set('content-type', 'application/json')
    };
    this.loadingCreate = true;
    this.http.post(this.url+'api/kilakitu/v1/blog/save', uploadData)
      // this.http.post(this.url + 'api/kilakitu/v1/product/save', uploadData)
      .subscribe(
        data => {
          this.loadingCreate = false;
          console.log("---->",data);
          this.modalService.dismissAll();
          this.notifyService.showSuccess("Successfully added blog","success");
          //this.listingDatatable.row.add(data).draw(false);
          this.categoriesDatatable.row.add(data).draw(false);
        },
        error => {
          this.loadingCreate = false;
          console.log('hello2 ', error);
          if (error.status === 409){
            this.notifyService.showError(error.error.message, "Problem");
          } else {
            // this.notifyService.showError("Something went wrong", "Problem");
          }
        }
      );
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
          title: 'Username',
          data: 'username',
          className: 'text-left'
        },
        {
          title: 'Title',
          data: 'title',
          className: 'text-left'
        },
        {
          title: 'Subtitle',
          data: 'subtitle',
          className: 'text-left'
        },
        {
          title: 'Description',
          data: 'description',
          className: 'text-left',
          render: (data: string, type: any, _row: any) => {
            if (type === 'display' && data?.length > 50) {
              return data.substring(0, 50) + '...';
            }
            return data;
          }
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
        targets: [6,7], // column index (start from 0)
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
      scope.article = data;
      console.log("cats -- ", data);
      // @ts-ignore
      scope.row = $(this).parents('tr');
      scope.editId = data['id'];

      data.rowIndex = row;
      scope.rowIndex = row;

      scope.open(scope.contentEditRef, 'xl');
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
    console.log("2 --", this.editId);
    console.log("23 --", form.value);
    let title = form.value.titleedit;
    let subtitle = form.value.subtitleedit;
    let description = form.value.descriptionedit;

    if (title === '' || subtitle === '' || description === ''){
      this.notifyService.showError("Enter All Fields", "Enter All Fields")
      return
    }
    this.loadingEdit = true;
    console.log("title --", title);
    console.log("subtitle --", subtitle);
    console.log("description --", description);
    //return
    console.log("2");
    this.loadingDelete = true;
    this.api.editArticle(this.editId, title, subtitle, description).subscribe((data: Blog) => {
      console.log(data);

      this.loadingEdit = false;
      this.notifyService.showSuccess("Success", "Successfully edited article");
      //this.categoriesDatatable.destroy(); // Destroy the existing DataTable
      //this.categoriesDatatable.row.add(data).draw(false);
      this.categoriesDatatable.row(this.rowIndex).data(data).draw(false);
      //this.categoriesDatatable.ajax.reload(null, false);
      this.modalService.dismissAll();
    }, error => {
      console.log("error", error)
      if (error.status === 409){
        this.notifyService.showError(error.error.message,"The article already exists");
        return;
      }

      this.loadingEdit = false;
      this.notifyService.showError("Problem", "Problem editing article");
    });
  }

  deleteCategorySubmit(){
    console.log("2--------------------");
    console.log(this.categorystatus);
    this.loadingDelete = true;

    this.api.deleteArticle(this.deleteId, this.categorystatus).subscribe((data: Blog) => {
      console.log(data);
      this.loadingDelete = false;
      this.notifyService.showSuccess("Success", "Successfully "+this.deletecategory+" article");
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
