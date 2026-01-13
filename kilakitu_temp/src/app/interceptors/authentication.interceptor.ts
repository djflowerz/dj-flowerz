import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const data = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('the data - is ', data);
    const url:string = req.url;

    console.log('the data - is2 ', url);
    console.log('the data - is23 ', data['access_token']);
    if (url.includes("/api/kilakitu/v1/product/") ||
      url.includes("/api/kilakitu/v1/auth") ||
      url.includes("/api/kilakitu/v1/productcategory") ||
      url.includes("/api/kilakitu/v1/lipamdogo") ||
      url.includes("/api/kilakitu/v1/verifyemail")
    )
      return next.handle(req);
    if (data !== null) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + data['access_token']
        }
      });
      console.log("req ------------> ", req);
    }
    return next.handle(req);
  }
}
