import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ApiService} from "../service/api.service";
import {MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {ModalDismissReasons, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {Listing} from "../model/listing";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NotificationService} from "../service/notification.service";
import {ListingSheetModalComponent} from "./listing-sheet-modal/listing-sheet-modal.component";
import {Property} from "../model/property";
import {Booking} from "../model/booking";
import {Router} from "@angular/router";
import {EditListingSheetModalComponent} from "./edit-listing-sheet-modal/edit-listing-sheet-modal.component";
import {PropertyUnitSheetModalComponent} from "./property-unit-sheet-modal/property-unit-sheet-modal.component";
import {Productcategory} from "../model/productcategory";
import {Productsubcategory} from "../model/productsubcategory";
import {Product} from "../model/product";
import {Productimages} from "../model/productimages";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  bottomSheetRef = {} as MatBottomSheetRef<ListingSheetModalComponent>
  editBottomSheetRef = {} as MatBottomSheetRef<EditListingSheetModalComponent>
  propertyUnitBottomSheetRef = {} as MatBottomSheetRef<PropertyUnitSheetModalComponent>

  user: any;
  @ViewChild("fileinput") fileinput: ElementRef | undefined;
  url: string = "https://kilakitu.co.ke/";
  // url: string = "http://localhost:8085/";

  navTag: string = 'host';
  coverImageSlider: string = "";
  coverImageSliderData = null;
  coverImageSliderId: number = 0;
  selectedFile!: File;
  listingDatatable: any;
  row: any;
  product: any;
  rowIndex: any;
  loadingCreate: boolean = false;
  loadingEdit: boolean = false;
  loadingCopy: boolean = false;
  loadingPromote: boolean = false;
  closeResult: string = '';
  @ViewChild("contentPhotos") template: TemplateRef<any> | undefined;
  @ViewChild("contentPhotoSlider") templateContentPhotoSlider: TemplateRef<any> | undefined;
  @ViewChild("deleteListing") templateListingDelete: TemplateRef<any> | undefined;
  @ViewChild('imagesContent') imagesTemplateRef: TemplateRef<any> | undefined;
  @ViewChild('content') contentRef: TemplateRef<any> | undefined;
  @ViewChild('contentEdit') contentEditRef: TemplateRef<any> | undefined;
  @ViewChild('contentCopy') contentCopyRef: TemplateRef<any> | undefined;
  @ViewChild('listingStatus') listingStatusRef: TemplateRef<any> | undefined;
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

  imageToEdit: any;

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
  ratings = [1,2,3,4,5,6,7,8]

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

  ngAfterViewInit(){
    this.findCategories();
    this.findAllProducts();
    this.initListings([]);
  }

  createListingForm(form: NgForm){
    console.log(form.value);
    this.listing = form.value;
    console.log(this.listing);
    this.modalService.dismissAll();
    this.open(this.template, 'lg');
  }

  findCategories(){
    this.api.findAllCategories().subscribe((data: Productcategory[]) => {
      console.log('cats -- ',data[0]);
      this.subcategories = data[0].productSubCategories;
      console.log('catssubs -- ',this.subcategories);
      this.categories = data;

    });
  }

  findAllProducts(){
    this.api.findAllProducts().subscribe((data: Product[]) => {
      console.log(data);
      data.forEach((values, keys) => {
        console.log("data1 - ", values );
        // console.log("data1 - ", JSON.parse(values.images) );
        // this.thumbnails.push(JSON.parse(values.images));
      });
      //this.initListings(data)
      this.listingDatatable.clear().rows.add(data).draw();
    });
  }

  initListings(data: Product[]) {
    console.log("pochazzzooooooo505r {}", data)

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
          title: 'Sub Category',
          data: 'subcategory',
          className: 'text-center'
        },
        {
          title: 'Colour',
          data: 'color',
          className: 'text-center'
        },
        {
          title: 'Brand',
          data: 'brand',
          className: 'text-center'
        },
        {
          title: 'Memory',
          data: 'memory',
          className: 'text-center'
        },
        {
          title: 'Storage',
          data: 'storage',
          className: 'text-center'
        },
        {
          title: 'Quantity',
          data: 'quantity',
          className: 'text-center'
        },
        {
          title: 'Condition',
          data: 'condition',
          className: 'text-center'
        },
        {
          title: 'Cost',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return 'Ksh ' + row.cost;
          }
        },
        {
          title: 'Discount',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return 'Ksh ' + row.discount;
          }
        },
        {
          title: 'Status',
          data: null,
          className: 'text-center',
          render: (_data: any, type: any, row: any) => {
            return row.status == 0 ? 'Pending' : 'Approved';
          }
        },
        {
          title: 'Listing Date',
          data: 'datecreated',
          className: 'text-center'
        },
        {
          title: '',
          data: null,
          className: 'text-center images',
          defaultContent: '<i style="color: green; cursor: pointer; align-content: center; text-align: center" class="fa fa-photo"></>',
          responsivePriority: 1
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
          className: 'text-center copy',
          defaultContent: '<i style="color: brown; cursor: pointer; align-content: center; text-align: center" class="fa fa-copy"></>',
          responsivePriority: 1
        },
        {
          title: '',
          data: null,
          className: 'text-center approve',
          render: (_data: any, type: any, row: any) => {
            return row.status == 0 ? '<i style="color: firebrick; cursor: pointer; align-content: center; text-align: center" class="fa fa-unlock-alt"></>' :
              '<i style="color: green; cursor: pointer; align-content: center; text-align: center" class="fa fa-lock"></>';
          }
        },
      ],
      columnDefs: [{
        targets: [9,10,11], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }],
    };

    this.listingDatatable = $('#dtListing').DataTable(dtOptions);
    const scope = this;
    const listingDiv = '#dtListing tbody';

    $(listingDiv).on('click', 'td.images', function() {
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.listingDatatable.row(tr);
      const data = row.data();
      console.log(data);
      const images = data.productImages;
      scope.product = data;
      scope.coverImageSliderData = data;
      scope.coverImageSlider = data.coverimage;
      scope.coverImageSliderId = data.id;
      console.log(images);
      scope.thumbnails = images;
      scope.rowIndex = row;
      scope.open(scope.templateContentPhotoSlider, 'md');
    });

    $(listingDiv).on('click', 'td.edit', function() {
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.listingDatatable.row(tr);
      const data = row.data();
      console.log('subs -> ', data.subcategory);
      scope.deleteId = data['id'];
      // @ts-ignore
      scope.row = $(this).parents('tr');
      scope.product = data;
      scope.subcategoryz = "pp";
      //scope.subcategories.push({id: 1, name: data.subcategory});
      console.log("rr1 ",data);
      console.log("rr2 ",scope.row);
      data.rowIndex = row;
      scope.rowIndex = row;
      scope.open(scope.contentEditRef, 'lg');
    });

    $(listingDiv).on('click', 'td.copy', function() {
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.listingDatatable.row(tr);
      const data = row.data();
      console.log('subs -> ', data.subcategory);
      scope.deleteId = data['id'];
      // @ts-ignore
      scope.row = $(this).parents('tr');
      scope.product = data;
      scope.subcategoryz = "pp";
      //scope.subcategories.push({id: 1, name: data.subcategory});
      console.log("rr1 ",data);
      console.log("rr2 ",scope.row);
      data.rowIndex = row;
      scope.rowIndex = row;
      scope.open(scope.contentCopyRef, 'lg');
    });

    $(listingDiv).on('click', 'td.approve', function() {
      // @ts-ignore
      const tr = $(this).closest('tr');
      const row = scope.listingDatatable.row(tr);
      const data = row.data();
      data.rowIndex = row;
      scope.rowIndex = row;
      scope.product = data;
      scope.listingId = data.id;
      if (data.status == 0){
        scope.listingStatus = 1;
        scope.listingStatusTitle = "Promote Product";
        scope.listingStatusContent = "Do you want to promote this product?";
      } else {
        scope.listingStatus = 0;
        scope.listingStatusTitle = "Demote Product";
        scope.listingStatusContent = "Do you want to demote this product?";
      }
      scope.deleteId = data['id'];
      // @ts-ignore
      scope.row = $(this).parents('tr');
      console.log("rr1 ",data);
      console.log("rr2 ",scope.row);
      //scope.open(scope.templateListingDelete, 'sm');
      scope.open(scope.listingStatusRef, 'md');
    });
  }

  open2(content: any, size: any){
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, centered: true });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason : any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCsv(content: any, size: any){
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

  list(form: NgForm){
    this.formData = form.value;
    console.log("formData ", this.formData)
    this.modalReference.close();
    this.open(this.imagesTemplateRef, 'lg');
  }
  selectedSubcategory: string = ''; // <-- add this property
  // onCategoryChange(event: any){
  //   console.log("event ", event.target.value);
  //   let name = event.target.value;
  //   this.categories.forEach(x => {
  //     if (x.name == name){
  //       this.subcategories = x.productSubCategories;
  //     }
  //   });
  // }
  onCategoryChange(event: any) {
    const name = event.target.value;
    const category = this.categories.find(x => x.name === name);

    if (category) {
      this.subcategories = category.productSubCategories || [];

      // ✅ Automatically select the first subcategory if available
      if (this.subcategories.length > 0) {
        this.selectedSubcategory = this.subcategories[0].name;
      } else {
        this.selectedSubcategory = ''; // reset if none
      }
    }
  }
  upload2(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    console.log(files);
  }

  onChange(file: any, tag: string) {
    console.log(file, tag);
    let photo = file[0]['name'];
    let fileSize = file[0]['size'] / 1000000;
    console.log("fileSize=>",fileSize);
    if (fileSize > 2){
      this.notifyService.showError("Image too large, maximum image size is 2mb","Image too large");
      return
    }

    let mimeType = file[0].type;
    console.log("mimeType=>",mimeType);
    if (mimeType.match(/image\/*/) == null) {
      this.notifyService.showError("Only images are supported","Only Images");
      return;
    }


    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      if (tag == 'cover'){
        this.coverImage = file[0];
        this.coverPhoto = true;
        this.coverPhotoImg = reader.result;
      } else if (tag == 'photo1'){
        this.photo1 = true;
        this.photosMap.set(tag, file);
        this.photo1Img = reader.result;
      } else if (tag == 'photo2'){
        this.photo2 = true;
        this.photosMap.set(tag, file);
        this.photo2Img = reader.result;
      } else if (tag == 'photo3'){
        this.photo3 = true;
        this.photosMap.set(tag, file);
        this.photo3Img = reader.result;
      } else if (tag == 'photo4'){
        this.photo4 = true;
        this.photosMap.set(tag, file);
        this.photo4Img = reader.result;
      } else if (tag == 'photo5'){
        this.photo5 = true;
        this.photosMap.set(tag, file);
        this.photo5Img = reader.result;
      } else if (tag == 'photo6'){
        this.photo6 = true;
        this.photosMap.set(tag, file);
        this.photo6Img = reader.result;
      } else if (tag == 'photo7') {
        this.photo7 = true;
        this.photosMap.set(tag, file);
        this.photo7Img = reader.result;
      }
    }
    console.log(this.photosMap);
  }

  changePhoto(item: any, name: string, tag: number){
    console.log(item)
    this.imageToEdit = name;
    // @ts-ignore
    // this.fileinput.nativeElement.click();
    if (tag === 0){
      // @ts-ignore
      document.getElementById('upload-file-active').click();
    } else {
      // @ts-ignore
      document.getElementById('upload-file-item').click();
    }
  }
  onImageChangeSubmit(file: any, item: any, name: string, id: number, tag: number)
  {
    let uploadData = new FormData();
    console.log("id -> ",id);
    console.log("name -> ",name);
    console.log("name2 -> ",this.imageToEdit);
    console.log("tag -> ",tag);
    console.log("--===------",file, item);
    console.log("--===------33",item);

   // return;

    console.log(file, item);
    let photo = file[0]['name'];
    let fileSize = file[0]['size'] / 1000000;
    console.log("fileSize=>",fileSize);
    if (fileSize > 2){
      this.notifyService.showError("Image too large, maximum image size is 2mb","Image too large");
      return
    }

    let mimeType = file[0].type;
    console.log("mimeType=>",mimeType);
    if (mimeType.match(/image\/*/) == null) {
      this.notifyService.showError("Only images are supported","Only Images");
      return;
    }

    uploadData.append('id', id.toString());
    uploadData.append('img', this.imageToEdit);
    uploadData.append('image', file[0]);
    uploadData.append('tag', tag.toString());

    this.http.put(this.url + 'api/kilakitu/v1/product/editimage', uploadData)
      // this.http.post(this.url + 'api/kilakitu/v1/product/save', uploadData)
      .subscribe(
        data => {
          this.loadingCreate = false;
          console.log("---->",data);
          this.modalService.dismissAll();
          this.notifyService.showSuccess("Successfully edited image","success");
          //this.listingDatatable.row.add(data).draw(false);
          //this.listingDatatable.row.add(data).draw(false);
          this.listingDatatable.row(this.rowIndex).data(data).invalidate().draw();
        },
        error => {
          this.loadingCreate = false;
          console.log('hello2 ', error);
          if (error.status === 409){
            this.notifyService.showError(error.error.message, "Problem editing image");
          } else {
            // this.notifyService.showError("Something went wrong", "Problem");
          }
        }
      );
  }

  upload() {
    console.log('uploadListing -> ');
    let photos = this.photosMap;
    let photosLength = photos.size;

    if (photosLength < 2) {
      console.log("size less");
      this.notifyService.showError("4 images minimum","Please enter more than 4 images");
      return;
    }

    console.log("size more");

    let uploadData = new FormData();


    photos.forEach((values, keys) => {
      console.log("the files -> "  + values[0]);
      uploadData.append('files', values[0]);
    });

    let storage = this.formData['storage'];
    let memory = this.formData['memory'];
    let brand = this.formData['brand'];

    //return
    uploadData.append('coverimage', this.coverImage);
    uploadData.append('name', this.formData['name']);
    uploadData.append('category', this.formData['category']);
    uploadData.append('subcategory', this.formData['subcategory']);
    uploadData.append('condition', this.formData['condition']);
    uploadData.append('color', this.formData['color']);
    uploadData.append('cost', this.formData['cost']);
    uploadData.append('brand', brand === '' ? "Nil" : brand);
    uploadData.append('memory', memory === '' ? "Nil" : memory);
    uploadData.append('storage', storage === '' ? "Nil" : storage);
    uploadData.append('rating', "5");
    uploadData.append('discount', "0");
    uploadData.append('classification', "3");
    uploadData.append('quantity', this.formData['quantity']);
    uploadData.append('description', this.formData['description']);
    uploadData.append('about', this.formData['about']);

    uploadData.forEach((values, keys) => {
      console.log("keys " + keys);
      console.log("values " + values);
    });

    const options = {
      headers: new HttpHeaders()
        .set('content-type', 'application/json')
    };
    this.loadingCreate = true;
    this.http.post(this.url+'api/kilakitu/v1/product/save', uploadData)
      // this.http.post(this.url + 'api/kilakitu/v1/product/save', uploadData)
      .subscribe(
        data => {
          this.loadingCreate = false;
          console.log("---->",data);
          this.modalService.dismissAll();
          this.notifyService.showSuccess("Successfully added listing","success");
          //this.listingDatatable.row.add(data).draw(false);
          this.listingDatatable.row.add(data).draw(false);
        },
        error => {
          this.loadingCreate = false;
          console.log('hello2 ', error);
          if (error.status === 409){
            this.notifyService.showError(error.error.message, "The product already exists");
          } else {
            // this.notifyService.showError("Something went wrong", "Problem");
          }
        }
      );
  }

  edit(form: NgForm){
    console.log("--->>",form.value)
    let id = this.product.id;
    let name = form.value.name;
    let category = form.value.category;
    let subcategory = form.value.subcategory;
    let color = form.value.color;
    let brand = form.value.brand;
    let memory = form.value.memory;
    let storage = form.value.storage;
    let cost = form.value.cost;
    let rating = form.value.rating;
    let discount = form.value.discount;
    let quantity = form.value.quantity;
    let description = form.value.description;
    let about = form.value.about;

    console.log("1", id);
    console.log("2", name);
    console.log("3", category);
    console.log("4", subcategory);
    console.log("5", color);
    console.log("storage0", brand);
    console.log("storage1", memory);
    console.log("storage2", storage);
    console.log("6", cost);
    console.log("7", rating);
    console.log("8", discount);
    console.log("9", quantity);
    console.log("10", description);
    console.log("11", about);

    // if (name == '' || category == '' || subcategory == '' || color == '' || cost == '' || discount == '' || quantity == '' || description == ''){
    //   this.notifyService.showError("Please enter all fields","Enter fields");
    //   return;
    // }

    this.loadingEdit = true;
    this.api.editProduct2(id, name, category, subcategory, color, brand, memory, storage, cost, rating, discount, quantity, description, about, "None")
      .subscribe((data: Product) => {
        console.log(data);
        this.loadingEdit = false;
        this.notifyService.showSuccess("Successful", "Successful edited product");
        this.listingDatatable.row(this.rowIndex).data(data).invalidate().draw();
        this.modalService.dismissAll();
      }, error => {
        this.loadingEdit = false;
        console.log("error ", error);
      });
  }

  copy(form: NgForm){
    console.log("--->>",form.value)
    let id = this.product.id;
    let name = form.value.name;
    let category = form.value.category;
    let subcategory = form.value.subcategory;
    let color = form.value.color;
    let brand = form.value.brand;
    let memory = form.value.memory;
    let storage = form.value.storage;
    let cost = form.value.cost;
    let rating = form.value.rating;
    let discount = form.value.discount;
    let quantity = form.value.quantity;
    let description = form.value.description;
    let about = form.value.about;

    console.log("1", id);
    console.log("2", name);
    console.log("3", category);
    console.log("4", subcategory);
    console.log("5", color);
    console.log("storage0", brand);
    console.log("storage1", memory);
    console.log("storage2", storage);
    console.log("6", cost);
    console.log("7", rating);
    console.log("8", discount);
    console.log("9", quantity);
    console.log("10", description);
    console.log("11", about);

    // if (name == '' || category == '' || subcategory == '' || color == '' || cost == '' || discount == '' || quantity == '' || description == ''){
    //   this.notifyService.showError("Please enter all fields","Enter fields");
    //   return;
    // }

    this.loadingCopy = true;
    this.api.copyProduct(id, name, category, subcategory, color, brand, memory, storage, cost, rating, discount, quantity, description, about, "None")
      .subscribe((data: Product) => {
        console.log(data);
        this.loadingCopy = false;
        this.notifyService.showSuccess("Successful", "Successful copied product");
        this.listingDatatable.row.add(data).draw(false);
        this.modalService.dismissAll();
      }, error => {
        this.loadingCopy = false;
        console.log("error ", error);
      });
  }

  onFileSelectedCsv(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadCsv() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post(this.url+'api/kilakitu/v1/product/uploadcsv', formData)
      .subscribe(data => {
        console.log(data)
          this.modalService.dismissAll();
          this.notifyService.showSuccess("Successfully added products","success");
          //this.listingDatatable.row.add(data).draw(false);
          this.listingDatatable.rows.add(data).draw(false);
      },
        error => {
          console.log('hello2 ', error);
          if (error.status === 409){
            this.notifyService.showError(error.error.message, "One of the product already exists");
          } else {
            // this.notifyService.showError("Something went wrong", "Problem");
          }
        });
  }

  statusUpdate(){
    this.loadingPromote = true;
    this.api.productStatus(this.listingId, this.listingStatus).subscribe((data: Product) => {
      console.log(data);
      this.loadingPromote = false;
      let status = this.listingStatus == 1 ? "promoted" : "demoted";
      this.notifyService.showSuccess("Success", "Successfully "+status+" product");
      this.listingDatatable.row(this.rowIndex).data(data).invalidate().draw();
      this.modalService.dismissAll();
    }, error => {
      console.log("error", error)
      this.loadingPromote = false;
      this.notifyService.showError("Problem", "Problem updating product");
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


