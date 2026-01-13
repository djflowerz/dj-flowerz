import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Category} from "../model/category";
import {Observable} from "rxjs";
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-filters-navbar',
  templateUrl: './filters-navbar.component.html',
  styleUrls: ['./filters-navbar.component.scss']
})
export class FiltersNavbarComponent implements OnInit {

  @Input() public categories: Observable<any> | undefined;
  navbarOpen = false;
  email: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  selectedItemsAmenities: any = [];
  dropdownSettingsAmenities: any = {};
  productList: Category[]  = [];
  productList2: Category[]  = [];
  constructor(private api: ApiService) { }

  onItemSelectAmenities(item: any) {

  }

  onSelectAllAmenities(items: any) {

  }
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }



  ngOnInit() {
    this.dropdownSettingsAmenities = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    /*this.dropdownListAmenities = [
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
    ];*/


  }

}
