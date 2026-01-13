import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../service/api.service";
import {MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {ModalDismissReasons, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {Listing} from "../model/listing";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NotificationService} from "../service/notification.service";
import {Property} from "../model/property";
import {Booking} from "../model/booking";
import {Router} from "@angular/router";
import {Productcategory} from "../model/productcategory";
import {Productsubcategory} from "../model/productsubcategory";
import {Product} from "../model/product";
import {Productimages} from "../model/productimages";
import {Customer} from "../model/customer";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './user2.component.html',
  styleUrls: ['./user2.component.scss']
})
export class User2Component implements OnInit {
  user: any;

  url: string = "https://kilakitu.co.ke/";
  //url: string = "http://localhost:8085/";

  navTag: string = 'host';
  coverImageSlider: string = "";

  listingDatatable: any;
  row: any;
  product: any;
  rowIndex: any;
  loading: boolean = false;

  closeResult: string = '';
  @ViewChild("contentPhotos") template: TemplateRef<any> | undefined;
  @ViewChild("contentPhotoSlider") templateContentPhotoSlider: TemplateRef<any> | undefined;
  @ViewChild("deleteListing") templateListingDelete: TemplateRef<any> | undefined;
  @ViewChild('imagesContent') imagesTemplateRef: TemplateRef<any> | undefined;
  @ViewChild('content') contentRef: TemplateRef<any> | undefined;
  @ViewChild('contentEdit') contentEditRef: TemplateRef<any> | undefined;
  @ViewChild('deleteUserRef') deleteUserRef: TemplateRef<any> | undefined;
  listing: Listing = { userid: 0, name: "", location: "", category: "", subcategory: "", description: "", cost: 0, images: "" };

  thumbnails: Productimages[] = [];

  coverPhoto: boolean = false;
  photo1: boolean = false;
  photo2: boolean = false;
  photo3: boolean = false;
  photo4: boolean = false;
  photo5: boolean = false;
  photo6: boolean = false;
  photo7: boolean = false;

  coverPhotoImg: any;
  photo1Img: any;
  photo2Img: any;
  photo3Img: any;
  photo4Img: any;
  photo5Img: any;
  photo6Img: any;
  photo7Img: any;

  photosMap = new Map<string, any>();
  coverImage: any;

  coverPhotoImage: string = '';
  photo1Image: string = '';
  photo2Image: string = '';
  photo3Image: string = '';
  photo4Image: string = '';
  photo5Image: string = '';
  photo6Image: string = '';
  photo7Image: string = '';

  deleteId: any;

  modalReference: any;
  categories: Productcategory[] = [];
  subcategories: Productsubcategory[] = [];
  subcategoryz: string = "";
  formData: any;

  listingStatusTitle: string = "Promote Product";
  listingStatusContent: string = "Do you want to promote this product?";
  listingId: number = 0;
  listingStatus: number = 0;
  emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  prod: Product[] = [];
  constructor(private api: ApiService,
              private http: HttpClient,
              private router: Router,
              private notifyService: NotificationService,
              private modalService: NgbModal,
              private _bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    console.log()
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    let role = this.user['user']['role'];
    let id = this.user['user']['id'];

  }

  findAllProducts(){
    this.api.findAllProducts().subscribe((data: Product[]) => {
      data.forEach((values, keys) => {
        console.log("data1 - ", values );
        if(values.quantity <= 5){
          this.prod.push(values);
        }
      });
      this.listingDatatable.clear().rows.add(this.prod).draw();
      //this.initUsers(this.prod)
    });
  }
  ngAfterViewInit(){
    this.initUsers([]);
    this.findAllProducts()
  }

  createListingForm(form: NgForm){
    console.log(form.value);
    this.listing = form.value;
    console.log(this.listing);
    this.modalService.dismissAll();
    this.open(this.template, 'lg');
  }

  initUsers(data: Product[]) {
    console.log("pochazzzooooooo505r {}", data)

    const dtOptions = {
      data: data,
      responsive: true,
      destroy: true,
      retrieve: true,
      pageLength: 10,
      scrollX: true,
      order: [[0, 'desc']],

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
          title: 'Category',
          data: 'category',
          className: 'text-center'
        },
        {
          title: 'Subcategory',
          data: 'subcategory',
          className: 'text-center'
        },
        {
          title: 'Quantity',
          data: 'quantity',
          className: 'text-center'
        },
      ],
    };

    this.listingDatatable = $('#dtUser').DataTable(dtOptions);
    const scope = this;
    const listingDiv = '#dtUser tbody';
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

  createUser(form: NgForm){
    let name = form.value.name;
    let email = form.value.email;
    let phone = form.value.phone;

    if (name == '' || email == '' || phone == ''){
      this.notifyService.showError("Please enter all details", "Enter all details");
      return;
    }

    let fullnameparse: string[] = name.split(" ");
    if (name.length < 5 || fullnameparse.length < 2){
      this.notifyService.showError("Please enter a valid full name", "Invalid full name");
      return;
    }


    if (!this.emailRegex.test(email)){
      this.notifyService.showError("Please enter a valid email", "Invalid email");
      return;
    }

    if (phone.length != 10){
      this.notifyService.showError("Please enter a valid phone number", "Invalid phone number");
      return;
    }

    let data = {name: name, email: email, phone: "254"+phone.substring(1), role: "ADMIN",
      password: "nil", cpassword: "nil"}

    this.loading = true;
    this.api.createUser(data).subscribe(
      data => {
      console.log("data -> ", data);
      this.loading = false;
      this.modalService.dismissAll();
      this.notifyService.showSuccess("Successfully added user","success");
      this.listingDatatable.row.add(data).draw(false);
    }, error => {
        this.loading = false
      console.log("createUserError ", error.message)
      this.notifyService.showError(error.error.message, "Problem Occured");
    });
  }

  edit(form: NgForm){
    console.log("--->>",form.value)
    this.modalService.dismissAll();
    // let id = this.product.id;
    // let name = form.value.name;
    // let email = form.value.category;
    // let subcategory = form.value.subcategory;
    // let color = form.value.color;
    // let cost = form.value.cost;
    // let discount = form.value.discount;
    // let quantity = form.value.quantity;
    // let description = form.value.description;
    //
    // if (name == '' || category == '' || subcategory == '' || color == '' || cost == '' || discount == '' || quantity == '' || description == ''){
    //   this.notifyService.showError("Enter all","Please enter all fields");
    //   return;
    // }
    //
    // this.api.editProduct(id, name, category, subcategory, color, cost, discount, quantity, description)
    //   .subscribe((data: Product) => {
    //   console.log(data);
    //   this.notifyService.showSuccess("Successful", "Successful edited product");
    //   this.listingDatatable.row(this.rowIndex).data(data).invalidate().draw();
    //   this.modalService.dismissAll();
    // }, error => {
    //   console.log("error ", error);
    // });
  }

  deleteUser(){
    this.loading = true;
      this.api.deleteUser(this.deleteId).subscribe((data: Customer) => {
        console.log(data);
        this.loading = false;
        this.notifyService.showSuccess("Success", "Successfully deleted");
        this.listingDatatable.row(this.rowIndex).remove().draw();
        this.modalService.dismissAll();
      }, error => {
        console.log("error", error)
        this.loading = false;
        this.notifyService.showError("Problem", "Problem deleting user");
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

  receiveNavMessage($event: string){
    this.router.navigate(['/']);
  }
}
