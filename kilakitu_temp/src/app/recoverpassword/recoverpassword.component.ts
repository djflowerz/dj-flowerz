import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Listing} from "../model/listing";
import {NotificationService} from "../service/notification.service";
import {Payment} from "../model/payment";
import {Booking} from "../model/booking";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './recoverpassword.component.html',
  styleUrls: ['./recoverpassword.component.scss']
})
export class RecoverpasswordComponent implements OnInit {

  phone: string = '';
  changePassword: boolean = false;
  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(){

  }

  login(form: NgForm){}

  forgotPassword(form: NgForm){
    console.log(form.value)
    let phone = form.value.loginemail;

    if (phone === '' || phone.length !== 12){
      this.notifyService.showError("Please enter valid phone number", "Enter Phone")
      return
    }
    this.phone = phone
    this.api.forgotPassword(phone).subscribe(data => {
      console.log("forgotPassword - ", data)
      // @ts-ignore
      this.notifyService.showError(data['message'], data['message']);
      this.changePassword = true
    }, error => {
      this.changePassword = false
      this.notifyService.showError("Something went wrong",
        "Please try again");
      console.log(error);
    });
  }

  recoverPassword(form: NgForm){
    console.log("form - ", form.value)
    let otp = form.value.otp;
    let newpassword = form.value.newpassword;
    let confirmpassword = form.value.confirmpassword;
    console.log("newpassword - ", newpassword)
    console.log("confirmpassword - ", confirmpassword)
    if (otp === '' || newpassword === '' || confirmpassword === ''){
      this.notifyService.showError("Please enter all fields", "Enter All Fields")
      return
    }

    if (newpassword !== confirmpassword){
      this.notifyService.showError("Passwords do not match", "Password mismatch")
      return
    }

    if (newpassword.length < 5){
      this.notifyService.showError("Your password should be 6 characters or more", "Password too short")
      return
    }

    this.api.recoverPasswordWeb(this.phone, otp, newpassword, confirmpassword).subscribe(data => {
      console.log("recoverPasswordWeb - ", data)
      // @ts-ignore
      if (data['message'] === 'success'){
        this.router.navigate(["/"]);
        this.notifyService.showSuccess("Success", "You have successfully reset your password");
      } else {
        // @ts-ignore
        this.notifyService.showError(data['message'], data['message']);
      }
      // this.changePassword = true
    }, error => {
      // this.changePassword = false
      this.notifyService.showError("Something went wrong",
        "Please try again");
      console.log(error);
    });
  }

  signUp(){
    this.router.navigate(["/signin"]);
  }
}
