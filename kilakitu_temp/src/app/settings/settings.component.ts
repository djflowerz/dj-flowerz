import { Component } from '@angular/core';
import {ApiService} from "../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../service/notification.service";
import {HttpClient} from "@angular/common/http";
declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  navTag: string = 'host';
  user: any;
  investmentDatatable: any;
  email: string = ';'

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute,
              private modalService: NgbModal, private notifyService: NotificationService,
              private http: HttpClient,private router: Router) {
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.email = this.user.email;
  }

  receiveNavMessage($event: string){
    this.router.navigate(['/']);
  }
}
