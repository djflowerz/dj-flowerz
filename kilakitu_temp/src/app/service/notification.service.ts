import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string | undefined, title: string | undefined) {
    this.toastr.success(message, title, {
      positionClass: 'toast-bottom-right',
      enableHtml: true
    })
  }

  showError(message: string | undefined, title: string | undefined) {
    this.toastr.error(message, title, {
      positionClass: 'toast-bottom-right',
      enableHtml: true
    })
  }
}
