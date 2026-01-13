import {Component, OnInit} from '@angular/core';
import {ApiService} from "../service/api.service";
import {NotificationService} from "../service/notification.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
declare const $: any;

@Component({
  selector: 'app-my-listing',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  emailerror: boolean = false;
  passworderror: boolean = false;
  loading: boolean  = false;
  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private router: Router) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(){

  }

  login(form: NgForm){
    this.emailerror = false;
    this.passworderror = false;

    let values = form.value;
    console.log(values);

    let email = values.email;
    let password = values.password;

    if (email === ''){
      this.emailerror = true;
      return;
    }

    if (password === ''){
      this.passworderror = true;
      return;
    }

    if (email.length < 5){
      this.emailerror = true;
      return;
    }
    this.loading = true;
    let data = {email: email, password: password};
    this.api.authenticate(data).subscribe(data => {
      console.log("dz ",data);
      this.loading = false;
      // @ts-ignore
      if (data['user']['role'] != 'ADMIN' || data['user']['status'] != 1){
        this.notifyService.showError("You do not have the necessary privileges to access this platform", "Non Priviledged User");
        return;
      }
      localStorage.setItem('user', JSON.stringify(data));
      this.notifyService.showSuccess("Login Successful", "Success");
      this.router.navigate(["/dashboard"]);

    }, error => {
      this.loading = false;
      this.notifyService.showError("Email/Password combination is incorrect, please try again", "Wrong Credentials");
      console.log(error);
    });
  }

  signUp(){
    this.router.navigate(["/signup"]);
  }
}
