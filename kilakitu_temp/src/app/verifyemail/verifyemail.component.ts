import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {NotificationService} from "../service/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.scss']
})
export class VerifyemailComponent implements OnInit {
  otperror: boolean = false;
  email: string = ';'

  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute
      .params
      .subscribe(params => {
        console.log("--->> ",params);
        if (Object.keys(params).length == 0) {
          console.log("---|||");
          return;
        }

        this.email = params['email'];
      });
  }

  ngAfterViewInit(){

  }

  verifyEmail(form: NgForm){
    this.otperror = false;

    let values = form.value;

    let otp = values.otp.trim()

    if (otp === ''){
      this.otperror = true;
      return;
    }

      let data = {email: this.email, otp: otp}
      this.api.verifyEmail(data).subscribe(data => {
        console.log("dz2 ",data);
        this.notifyService.showSuccess("Verification successful", "Confirmation Code");
        //this.router.navigate(['/']);
      }, error => {
        console.log(error);
        if (error.status == 409){
          this.notifyService.showError(error.error.message, error.error.message);
          return;
        }

        if (error.status == 404){
          this.notifyService.showError("Confirmation error", "The OTP is incorrect");
          return;
        }
        this.notifyService.showError("Something went wrong, please try again", "Oops");

      });
  }

  resendCode(){
    this.api.resendCode(this.email).subscribe(data => {
      console.log("dz2r ",data);
      this.notifyService.showSuccess("Success", "Confirmation code sent");
      //this.router.navigate(['/']);
    }, error => {
      console.log(error);
      //this.notifyService.showError("Something went wrong, please try again", "Oops");
      this.notifyService.showSuccess("Success", "Confirmation code sent");
    });
  }

  signUp(){
    this.router.navigate(["/signup"]);
  }
}
