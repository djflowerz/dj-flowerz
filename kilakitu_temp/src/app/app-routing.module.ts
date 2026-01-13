import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthorizeGuard} from "./guard/authorize.guard";

const routes: Routes = [{path: '', redirectTo: '/', pathMatch: 'full'},
  {
    path: '',
    loadChildren: () => import('src/app/signin/signin.module').then(m => m.SigninModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('src/app/signin/signin.module').then(m => m.SigninModule)
  },
  {
    path: 'verifyemail/:email',
    loadChildren: () => import('src/app/verifyemail/verifyemail.module').then(m => m.VerifyemailModule)
  },
  {
    path: 'recoverpassword',
    loadChildren: () => import('src/app/recoverpassword/recoverpassword.module').then(m => m.RecoverpasswordModule)
  },
  {
    path: 'payment',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/payment/payment.module').then(m => m.PaymentModule)
  },
  {
    path: 'users',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'stocklevels',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/user2/user2.module').then(m => m.User2Module)
  },
  {
    path: 'orders',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/booking/booking.module').then(m => m.BookingModule)
  },
  {
    path: 'lipamdogomdogo',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/lipamdogo/lipamdogo.module').then(m => m.LipamdogoModule)
  },
  {
    path: 'customers',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'invoice',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/invoice/invoice.module').then(m => m.InvoiceModule)
  },
  {
    path: 'notification',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'categories',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'products',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'blog',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/blog/blog.module').then(m => m.BlogModule)
  },
  {
    path: 'setting',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'orderlogs',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/orderlogs/orderlogs.module').then(m => m.OrderlogsModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/admin-home/admin-home.module').then(m => m.AdminHomeModule)
  },
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
