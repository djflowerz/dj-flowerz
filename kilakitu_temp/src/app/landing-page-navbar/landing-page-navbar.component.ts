import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";
import {NotificationService} from "../service/notification.service";
import {ApiService} from "../service/api.service";
import {AppQuery} from "../main-navbar/app.query";
@Component({
  selector: 'app-landing-page-navbar',
  templateUrl: './landing-page-navbar.component.html',
  styleUrls: ['./landing-page-navbar.component.scss']
})
export class LandingPageNavbarComponent implements OnInit {
  user: any;
  isLogin: boolean = false;
  margin = 10;
  closeResult = '';
  @Input() navTag: string = "default";
  activeLink: string = "All";

  myEmail: string = "";

  tabIndex$ = this.query.dialogTabIndex

  navbarOpen = false;
  email: any;
  constructor(private router: Router,
              private modalService: NgbModal,
              private api: ApiService,
              private query: AppQuery,
              private notificationService: NotificationService) { }


  toggleNavbar() {
    console.log("toggleNavbar");
    this.navbarOpen = !this.navbarOpen;
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log("userz", this.user);
    if (Object.keys(this.user).length != 0) {
      this.isLogin = true;
      this.myEmail = this.user['user']['email'];
    }
  }

  hideNav(){
    this.navbarOpen = false;
  }

  explore(){
    this.navbarOpen = false;
    this.router.navigate(["/property/all"]);
  }

  openModal(content: any) {
    this.navbarOpen = false;
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

  openModal2(content: any) {
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

  login(form: NgForm){
    console.log(form.value);
    let email = form.value.loginemail.trim();
    let password = form.value.loginpassword.trim();

    if (email === '' || password === ''){
      this.notificationService.showError("Please enter all details","Enter all details");
      return;
    }

    let data = {email: email, password: password};
    this.api.authenticate(data).subscribe(data => {
      console.log(data);
      this.isLogin = true;
      this.myEmail = email;
      localStorage.setItem('user', JSON.stringify(data));
      this.modalService.dismissAll()
      this.notificationService.showSuccess("Login Successful", "Success");

    }, error => {
      this.notificationService.showError("Email/Password combination is incorrect, please try again", "Wrong Credentials");
      console.log(error);
    });
  }

  register(form: NgForm){
    console.log(form.value);
    let name: string = form.value.regname.trim();
    let email: string = form.value.regemail.trim();
    let phone: string = form.value.regphone.trim();
    let password: string = form.value.regpassword.trim();
    let cpassword: string = form.value.regconfirmpassword.trim();

    console.log("name -> ", name);
    console.log("email -> ", email);
    console.log("phone -> ", phone);
    console.log("password -> ", password);
    console.log("cpassword -> ", cpassword);

    if (name === '' || email === '' || phone === ''|| password === '' || cpassword === ''){
      this.notificationService.showError("Please enter all details","Enter all details");
      return;
    }

    if (phone.length !=12){
      this.notificationService.showError("Please enter a valid phone number","Invalid Phone Number");
      return;
    }

    let data = {username: name, phone: phone, role: "USER", email: email, password: password, cpassword: cpassword}
    this.api.register(data).subscribe(data => {
      console.log(data);
      this.notificationService.showSuccess("Please log in to continue", "Confirmation Code");
      this.modalService.dismissAll();

    }, error => {
      console.log(error);
      if (error.status == 409){
        this.notificationService.showError(error.error.message, error.error.message);
        return;
      }
      // this.notificationService.showError("Something went wrong, please try again", "Oops");

    });
  }

  recoverPassword(form: NgForm){
    console.log(form.value);
    let email: string = form.value.recemail.trim();
    this.api.recoverPassword(email).subscribe(data => {
      console.log("808 - ",data);
      // @ts-ignore
      if (data['status'] == -1){
        this.notificationService.showError("This email address does not exist, please register to continue", "Register");
        return;
      }
      this.notificationService.showSuccess("Please check your email for password", "Email recovery");
      this.modalService.dismissAll();

    }, error => {
      console.log("error => ",error);
      if (error.status == -1){
        this.notificationService.showSuccess("This email address does not exist, please register to continue", "Register");
        return;
      }
      this.notificationService.showSuccess("Please check your email for password", "Email recovery");
      this.modalService.dismissAll();
    });
  }

  closeModal(){
    this.modalService.dismissAll()
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

  logOut(){
    this.isLogin = false;
    localStorage.clear();
  }

}
