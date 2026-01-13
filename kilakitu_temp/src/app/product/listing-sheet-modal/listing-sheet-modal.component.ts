import {Component, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../service/api.service';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {NotificationService} from "../../service/notification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, NgForm} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
declare var $: any;
@Component({
  selector: 'app-listing-sheet-modal',
  templateUrl: './listing-sheet-modal.component.html',
  styleUrls: ['./listing-sheet-modal.component.scss']
})
export class ListingSheetModalComponent {
  @ViewChild('imagesContent') imagesTemplateRef: TemplateRef<any> | undefined;
  property: any = {};
  closeResult = '';
  resolve = true;
  amenities: string[] = [];
  extras: string[] = [];

  listingDatatable: any;

  //url = "http://165.227.173.143:8085/";
  url = 'https://kilakitu.co.ke/';
  //url = 'http://localhost:8085/';
  loading: boolean = false;
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};

  options2: any;
  latitude: string = "";
  longitude: string = "";
  formattedaddress="";

  dropdownListAmenities: any = [];
  selectedItemsAmenities: any = [];
  dropdownSettingsAmenities: any = {};
  email: string;
  userid: string;

  user: any;

  files: any = [];
  filteredOptions: Observable<string[]> | undefined;
  myControl = new FormControl('');
  options: string[] = ['Kisumu', 'Nairobi', 'Machakos'];

  coverPhoto: boolean = false;
  photo1: boolean = false;
  photo2: boolean = false;
  photo3: boolean = false;
  photo4: boolean = false;
  photo5: boolean = false;
  photo6: boolean = false;
  photo7: boolean = false;

  photosMap = new Map<string, any>();

  coverPhotoImg: any;
  photo1Img: any;
  photo2Img: any;
  photo3Img: any;
  photo4Img: any;
  photo5Img: any;
  photo6Img: any;
  photo7Img: any;

  coverPhotoImage: string = '';
  photo1Image: string = '';
  photo2Image: string = '';
  photo3Image: string = '';
  photo4Image: string = '';
  photo5Image: string = '';
  photo6Image: string = '';
  photo7Image: string = '';

  formData: any;

  constructor(private _bottomSheetRef: MatBottomSheetRef<ListingSheetModalComponent>,
              private api: ApiService, private modalService: NgbModal, private _bottomSheet: MatBottomSheet,
              private notifyService: NotificationService, private http: HttpClient,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    console.log("inject ---- ", data);

    this.email = data.user.email;
    this.userid = data.user.id;
    this.listingDatatable = data.dtListing;
    console.log("listingDatatable - ",this.listingDatatable);
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.options2 = {componentRestrictions:{country:["KE"]}, fields: ["address_components", "geometry", "icon", "name"]}
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };

    this.dropdownSettingsAmenities = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };

    this.dropdownList = [
      { item_id: 1, item_text: 'Check in after 12:00pm' },
      { item_id: 2, item_text: 'Check out after 11:00 am' },
      { item_id: 3, item_text: 'No Pets' },
      { item_id: 4, item_text: 'No Smoking' },
      { item_id: 5, item_text: 'No Parties/Events' },
    ];

    this.dropdownListAmenities = [
      { item_id: 1, item_text: 'CCTV' },
      { item_id: 2, item_text: 'Pool' },
      { item_id: 3, item_text: 'Wifi' },
      { item_id: 4, item_text: 'Parking' },
      { item_id: 5, item_text: 'Balcony' },
      { item_id: 6, item_text: 'Security' },
      { item_id: 7, item_text: 'Hot Water' },
      { item_id: 8, item_text: 'Air Conditioning' },
      { item_id: 9, item_text: 'Fire Extinguisher' },
    ];
    this.selectedItems = [
      /*{ item_id: 1, item_text: 'TV' },
      { item_id: 2, item_text: 'Wifi' }*/
    ];

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onItemSelect(item: any) {
    this.extras.push(item['item_text'])
  }

  onSelectAll(items: any) {
    items.forEach((a: any) => {
      this.extras.push(a['item_text'])
    })
  }

  onItemSelectAmenities(item: any) {
    this.amenities.push(item['item_text'])
  }

  onSelectAllAmenities(items: any) {
    items.forEach((a: any) => {
      this.amenities.push(a['item_text'])
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
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


    this._bottomSheetRef.dismiss(this.formData);
    this.open(this.imagesTemplateRef);

    // console.log(form.value);
    // if (this.amenities.length === 0) {
    //   this.notifyService.showError("Please select amenities", "Show amenities");
    //   return;
    // }
    //
    // if (this.files.length < 4) {
    //   this.notifyService.showError("Please upload at least 4 photos", "Upload photos");
    //   return;
    // }
    //
    // let data = {form: form.value, amenities: this.amenities, files: this.files}
    // console.log(data)
    // //this._bottomSheetRef.dismiss(data);
    // this.uploadListing(data)

  }

  public addressChange(address: any) {
    //setting address from API to local variable
    console.log(address)
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.formattedaddress=address.name;

    let data = {latitude: this.latitude, longitude: this.longitude, address: this.formattedaddress}
    //this.router.navigate(['/search',"all",this.latitude,this.longitude]);
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

    this.photosMap.set(tag, file);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (_event) => {
      if (tag == 'cover'){
        this.coverPhoto = true;
        this.coverPhotoImg = reader.result;
      } else if (tag == 'photo1'){
        this.photo1 = true;
        this.photo1Img = reader.result;
      } else if (tag == 'photo2'){
        this.photo2 = true;
        this.photo2Img = reader.result;
      } else if (tag == 'photo3'){
        this.photo3 = true;
        this.photo3Img = reader.result;
      } else if (tag == 'photo4'){
        this.photo4 = true;
        this.photo4Img = reader.result;
      } else if (tag == 'photo5'){
        this.photo5 = true;
        this.photo5Img = reader.result;
      } else if (tag == 'photo6'){
        this.photo6 = true;
        this.photo6Img = reader.result;
      } else if (tag == 'photo7') {
        this.photo7 = true;
        this.photo7Img = reader.result;
      }
    }
    console.log(this.photosMap);
  }

  upload(){
    if (this.photosMap.size < 2){
      this.notifyService.showError("Please upload more than 4 images", "Not enough images");
      return;
    }

    this.uploadListing(this.formData);

  }

  uploadListing(data:any){
    console.log('the data : ', data);
    this.loading = true;

    let uploadData = new FormData();


    this.photosMap.forEach((k,v) => {
      uploadData.append('files', k[0]);
    });

    let amenityArray: any = [];
    data.amenities.forEach((a: any)=> {
      amenityArray.push(a['item_text']);
    })

    let extrasArray: any = [];
    data.extras.forEach((a: any)=> {
      extrasArray.push(a['item_text']);
    })

    // let units = data.units.toUpperCase().split(",");
    // console.log(units);

    // uploadData.append('userid', this.userid);
    uploadData.append('email', this.user['user']['email']);
    uploadData.append('title', data.title);
    uploadData.append('type', data.type);
    uploadData.append('location', this.formattedaddress);
    // uploadData.append('location', data.form.location);
    uploadData.append('guests', '0');
    uploadData.append('bathrooms', data.bathrooms);
    uploadData.append('beds', data.beds);
    uploadData.append('amenities', amenityArray.toString());
    uploadData.append('extras', extrasArray.toString());
    uploadData.append('cost', data.cost);
    uploadData.append('stay', data.stay);
    uploadData.append('units', data.units);
    uploadData.append('waterbill', data.waterbill);
    uploadData.append('garbagebill', data.garbagebill);
    uploadData.append('paymentdetails', data.paymentdetails);
    uploadData.append('description', data.description);
    uploadData.append('cancellationpolicy', data.cancellationpolicy);
    uploadData.append('latitude', this.latitude);
    uploadData.append('longitude', this.longitude);
    uploadData.append('platform', 'web');

    // @ts-ignore
    let tkn = this.user['access_token'];
    const options = {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + tkn)
    };
    this.http.post(this.url + 'api/rentpesa/v2/property/save', uploadData, options)
      .subscribe(
        data => {
          console.log("thedare-0---", data);
          this.loading = false;
          this.modalService.dismissAll();
          this.notifyService.showSuccess('Successfully uploaded listing', 'success');
          // @ts-ignore
          data['user'] = this.user['user'];
          //this._bottomSheetRef.dismiss(data);

          // this.dtListingsDatatable.clear().rows.add(data).draw();
          this.listingDatatable.row.add(data).draw(false);
          // setTimeout(function () { $("#dtProperties").DataTable().row(0).deselect(); }, 5000);
          console.log('hello ', data);
        },
        error => {
          // console.log('hello404 ', modalRef);

          if (error.status === 409){
            this.notifyService.showError(error.error.message, "Problem");
          } else {
            this.notifyService.showError("Something went wrong", "Problem");
          }
        }
      );
  }

  fileChangeEventPropertyImages(files: any) {
    console.log('fileChangeEventPropertyImages ', files);
    this.files = files;
    if (files.length < 3) {
      this.resolve = false;
      this.notifyService.showError('Please upload at least 3 images', 'Upload images');
      return;
    }

    const fileSize = files[0].size / 1000000;
    console.log('fileSize=>', fileSize);

    if (fileSize > 10) {
      this.resolve = false;
      this.notifyService.showError('Image too large, The maximum image size is 5mb', 'Image too large');
      return;
    }

    this.resolve = true;
   // this.modalData.propertyImages = files;
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
