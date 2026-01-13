import { Component } from '@angular/core';
// @ts-ignore
import * as CanvasJS from '../../assets/js/canvasjs.min.js';
import {ApiService} from "../service/api.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../service/notification.service";
import {Admindashboardmetrics} from "../model/admindashboardmetrics";
import {Usersmetrics} from "../model/usersmetrics";
import {Router} from "@angular/router";
import {Metrics} from "../model/metrics";
import {Product} from "../model/product";
declare var $: any;
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
  navTag: string = 'guest';
  dtInvoiceDatatable: any;
  user: any;
  role: string = "";

  isAdmin = false;
  isLandLord = false;
  isCustomer = false;

  adminPropertyCount: number = 0;
  adminPropertyUnitsCount: number = 0;
  adminTenantCount: number = 0;

  usersCount: number = 0;
  landlordCount: number = 0;
  customerCount: number = 0;

  propertiesCount: number = 0;
  bookingsCount: number = 0;
  paymentsCount: number = 0;
  stockLevels: number = 0;


  constructor(private api: ApiService,
              private modalService: NgbModal,
              private router: Router,
              private notifyService: NotificationService) {
  }

  ngOnInit(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = this.user['user']['role'];
    let userId = this.user['user']['id'];
    console.log("the role - ", this.role);

  }

  ngAfterViewInit(){
    //  this.initBookings([]);
    this.findAllProducts();
    this.loadAdminMetrics();
  }

  findAllProducts(){
    this.api.findAllProducts().subscribe((data: Product[]) => {
      console.log("ttt ->",data.length);
     // this.stockLevels = data.length;
      data.forEach((values, keys) => {
        if(values.quantity <= 5){
          this.stockLevels = this.stockLevels+1;
        }
        console.log("data1 - ", values );
        // console.log("data1 - ", JSON.parse(values.images) );
        // this.thumbnails.push(JSON.parse(values.images));
      });
    });
  }

  loadUserMetrics(id: number){
    this.api.userMetrics(id).subscribe(
      (data: Metrics) => {
        console.log(data);
        this.propertiesCount = data.properties;
        this.bookingsCount = data.bookings;
        this.paymentsCount = data.payments;
        let paymentsOverview = data.paymentOverview;
        let bookingsOverview = data.bookingOverview;
        paymentsOverview.forEach((x) => {
          // @ts-ignore
          x['exploded'] = true;
        })

        bookingsOverview.forEach((x) => {
          // @ts-ignore
          x['exploded'] = true;
        })

        this.loadCharts(paymentsOverview, bookingsOverview);
      }, error => {

        console.log(error);
        if (error.status == 403){
          this.notifyService.showError("Your session has expired, login to continue", "Session Expired");
          // localStorage.clear();
          // this.router.navigate(['/']);
        }
      });
  }

  loadAdminMetrics(){
    this.api.adminMetrics().subscribe(
      (data: Metrics) => {
        console.log("loadAdminMetrics - ",data);
        this.propertiesCount = data.properties;
        this.bookingsCount = data.bookings;
        this.paymentsCount = data.payments;
        let paymentsOverview = data.paymentOverview;
        let bookingsOverview = data.bookingOverview;
        paymentsOverview.forEach((x) => {
          // @ts-ignore
          x['exploded'] = true;
        })

        bookingsOverview.forEach((x) => {
          // @ts-ignore
          x['exploded'] = true;
        })

        this.loadCharts(paymentsOverview, bookingsOverview);
      }, error => {
        console.log(error);
        if (error.status == 403){
          this.notifyService.showError("Your session has expired, login to continue", "Session Expired");
          // localStorage.clear();
          // this.router.navigate(['/']);
        }
      });
  }

  loadCharts(data1: any, data2: any){
    console.log("data1", data1);
    var chart = new CanvasJS.Chart("chartContainer2", {
      animationEnabled: true,
      title:{
        text: "Orders Overview",
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'tahoma',
        horizontalAlign: "left"
      },
      data: [{
        type: "doughnut",
        startAngle: 60,
        //innerRadius: 60,
        indexLabelFontSize: 13,
        indexLabelFontFamily: "Montserrat",
        indexLabel: "{name} - {y}",
        toolTipContent: "<b>{label}:</b> {y}",
        dataPoints: data1
      }]
    });
    chart.render();

    var chart2 = new CanvasJS.Chart("chartContainer", {
      exportEnabled: false,
      animationEnabled: true,
      title:{
        text: "Customers Overview",
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'tahoma',
        horizontalAlign: "left"
      },
      legend:{
        cursor: "pointer",
        itemclick: this.explodePie
      },
      data: [{
        indexLabelFontSize: 13,
        indexLabelFontFamily: "Montserrat",
        type: "pie",
        toolTipContent: "{name}",
        indexLabel: "{name}",
        dataPoints: data2
      }]
    });
    chart2.render();
  }

  explodePie (e: any) {
    if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();
  }

  receiveNavMessage($event: string){
    this.router.navigate(['/']);
  }

  stockLevel(){
    this.router.navigate(['/stocklevels']);
  }
}
