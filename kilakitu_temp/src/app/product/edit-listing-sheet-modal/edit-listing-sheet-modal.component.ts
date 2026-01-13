import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../service/api.service';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {NotificationService} from "../../service/notification.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormControl, NgForm} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {User} from "../../model/user";
import {Property} from "../../model/property";
import {Listing} from "../../model/listing";
declare var $: any;
@Component({
  selector: 'app-listing-sheet-modal',
  templateUrl: './edit-listing-sheet-modal.component.html',
  styleUrls: ['./edit-listing-sheet-modal.component.css']
})
export class EditListingSheetModalComponent {
  user: User = {};
  property: any = {};
  closeResult = '';
  resolve = true;
  amenities: string[] = [];
  extras: string[] = [];
  listingDatatable: any;
  url = 'https://kilakitu.co.ke/';
  //url = 'http://localhost:8085/';
  loading: boolean = false;
  dropdownList: any = [];
  selectedItems: any = [];
  // selectedItemsAmenities: any = [];
  dropdownSettings: any = {};

  options2: any;
  latitude: string = "";
  longitude: string = "";
  formattedaddress="";

  dropdownListAmenities: any = [];
  selectedItemsAmenities: [] = [];
  selectedItemsExtras: [] = [];
  dropdownSettingsAmenities: any = {};
  email: string;
  userid: string;

  storage: any;

  propertyId: any;
  files: any = [];
  rowIndex: any;
  filteredOptions: Observable<string[]> | undefined;
  myControl = new FormControl('');
  options: string[] = ['Kisumu', 'Nairobi', 'Machakos'];
  constructor(private _bottomSheetRef: MatBottomSheetRef<EditListingSheetModalComponent>,
              private api: ApiService, private modalService: NgbModal, private _bottomSheet: MatBottomSheet,
              private notifyService: NotificationService, private http: HttpClient,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    console.log("inject ---- ", data);
    this.email = data.user.email;
    this.userid = data.user.id;
    this.propertyId = data.id;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.formattedaddress = data.location;
    this.property = data;
    this.rowIndex = data.rowIndex;
    console.log("rowIndex -------->>>> ", this.rowIndex);
    this.selectedItemsAmenities = JSON.parse(this.property['amenities']);
    this.selectedItemsExtras = JSON.parse(this.property['extras']);
    console.log("selectedItemsAmenities - ",this.selectedItemsAmenities);
  //  this.findAllPropertyUnitsById(data.id);
  }

  ngOnInit(): void {
    this.storage = JSON.parse(localStorage.getItem('user') || '{}');
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
      { item_id: 1, item_text: 'TV' },
      { item_id: 2, item_text: 'Wifi' },
      { item_id: 3, item_text: 'Pool' },
      { item_id: 4, item_text: 'Washer' },
      { item_id: 5, item_text: 'Kitchen' },
      { item_id: 6, item_text: 'Parking' },
      { item_id: 7, item_text: 'Hot Water' },
      { item_id: 8, item_text: 'Essentials' },
      { item_id: 9, item_text: 'Refrigerator' },
      { item_id: 10, item_text: 'Game Console' },
      { item_id: 11, item_text: 'Fire Extinguisher' },
      { item_id: 12, item_text: 'Air Conditioning' }
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

  list(form: NgForm){
    console.log(form.value);

    let data = {form: form.value, amenities: this.amenities, files: this.files}
    console.log(data)
    //this._bottomSheetRef.dismiss(data);
    this.editListing(data)

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

  editListing(data:any){
    console.log('longitudedata -> ', data);
    this.loading = true;
    //return;
    let uploadData = new FormData();

    let amenityArray: any = [];
    data.form.amenities.forEach((a: any)=> {
      console.log("amenities ---- > ",a['item_text']);
      if (a['item_text'] == undefined){
        amenityArray.push(a);
      } else {
        amenityArray.push(a['item_text']);
      }
    })

    let extrasArray: any = [];
    data.form.extras.forEach((a: any)=> {
      if (a['item_text'] == undefined){
        extrasArray.push(a);
      } else {
        extrasArray.push(a['item_text']);
      }
    })

    uploadData.append('id', this.propertyId);
    uploadData.append('email', this.storage['user']['email']);
    uploadData.append('title', data.form.title);
    uploadData.append('type', data.form.type);
    uploadData.append('location', this.formattedaddress);
    // uploadData.append('location', data.form.location);
    uploadData.append('guests', "0");
    uploadData.append('bathrooms', data.form.bathrooms);
    uploadData.append('beds', data.form.beds);
    uploadData.append('amenities', amenityArray.toString());
    uploadData.append('extras', extrasArray.toString());
    uploadData.append('cost', data.form.cost);
    uploadData.append('stay', data.form.stay);
    // uploadData.append('units', data.form.units);
    uploadData.append('waterbill', data.form.waterbill);
    uploadData.append('garbagebill', data.form.garbagebill);
    uploadData.append('description', data.form.description);
    uploadData.append('cancellationpolicy', data.form.cancellationpolicy);
    uploadData.append('latitude', this.latitude);
    uploadData.append('longitude', this.longitude);
    uploadData.append('platform', 'web');

    // @ts-ignore
    let tkn = this.storage['access_token'];
    const options = {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer ' + tkn)
    };
    this.http.put(this.url + 'api/rentpesa/v2/property/edit', uploadData, options)
      .subscribe(
        data => {
          this.loading = false;
          this.modalService.dismissAll();
          this.notifyService.showSuccess('Successfully edited listing', 'success');
          this._bottomSheetRef.dismiss({rowIndex: this.rowIndex, data: data});
          // this.dtListingsDatatable.clear().rows.add(data).draw();
         // this.dtListingsDatatable.row.add(data).draw(false);
          // setTimeout(function () { $("#dtProperties").DataTable().row(0).deselect(); }, 5000);
          console.log('hello ', data);
        },
        error => {
          // console.log('hello404 ', modalRef);

          if (error.status === 409){
            this.notifyService.showError(error.error.message, "Problem");
          } else {
            // this.notifyService.showError("Something went wrong", "Problem");
          }
        }
      );
  }

  fileChangeEventPropertyImages(files: any) {
    console.log('fileChangeEventPropertyImages ', files);
    this.files = files;
    if (files.length < 4) {
      this.resolve = false;
      this.notifyService.showError('Please upload at least 4 images', 'Upload images');
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

  extractNameFromJsonParse(obj: any){
    return JSON.parse(obj);
  }

}
