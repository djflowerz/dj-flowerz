import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Category} from "../model/category";
import {Observable} from "rxjs";
import {ProductDto} from "../model/product-dto";
import {Product} from "../model/product";
import {Listing} from "../model/listing";
import {PropertyDto} from "../model/property-dto";
import {Property} from "../model/property";
import { Admindashboardmetrics } from '../model/admindashboardmetrics';
import {Usersmetrics} from "../model/usersmetrics";
import {Booking} from "../model/booking";
import {Payment} from "../model/payment";
import {PropertyUnit} from "../model/property-unit";
import {Metrics} from "../model/metrics";
import {Order} from "../model/order";
import {Productcategory} from "../model/productcategory";
import {Customer} from "../model/customer";
import {User} from "../model/user";
import {Lipamdogo} from "../model/lipamdogo";
import {Blog} from "../model/blog";
import {Orderlogs} from "../model/orderlogs";
const jwtHelper = new JwtHelperService();
const options = {

  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + sessionStorage.getItem("token"))
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url = "https://kilakitu.co.ke";
  // url = "http://localhost:8085";


  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !jwtHelper.isTokenExpired(token);
  }

  authenticate(user: any) {
    console.log(user);
    const url = this.url+"/api/kilakitu/v1/auth/authenticate";
    return this.http.post(url, user);
  }

  register(user: any) {
    console.log(user);
    const url = this.url+"/api/kilakitu/v1/auth/register";
    return this.http.post(url, user);
  }

  verifyEmail(user: any) {
    console.log(user);
    const url = this.url+"/api/kilakitu/v1/auth/verifyemail";
    return this.http.post(url, user);
  }

  recoverPasswordWeb(phone: string, otp: string, newpassword: string, confirmpassword: string) {
    const url = this.url+"/api/kilakitu/v1/auth/recoverpasswordweb?phone="+phone+'&otp='+otp+'&newpassword='+newpassword+'&confirmpassword='+confirmpassword;
    console.log(phone);
    return this.http.post(url, {});
  }

  resendCode(email: string) {
    const url = this.url+"/api/kilakitu/v1/auth/resendcode?email="+email;
    return this.http.post(url, {});
  }

  getItemsOrders(page: number, size: number, search: string, sort: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('start', page.toString());
    params = params.append('length', size.toString());
    params = params.append('searchValue', search);
    params = params.append('sort', sort);

    let url = this.url + '/api/kilakitu/v1/order/items';
    return this.http.get<any>(url, { params });
  }

  getItemsLipaMdogoMdogo(page: number, size: number, search: string, sort: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('start', page.toString());
    params = params.append('length', size.toString());
    params = params.append('searchValue', search);
    params = params.append('sort', sort);

    let url = this.url + '/api/kilakitu/v1/lipamdogo/items';
    return this.http.get<any>(url, { params });
  }

  forgotPassword(phone: string) {
    const url = this.url+"/api/kilakitu/v1/auth/forgotpassword?phone="+phone;
    console.log(phone);
    return this.http.post(url, {});
  }

  approveRejectSubscription(id: number, status: number) {
    const url = this.url + '/api/kilakitu/v1/lipamdogo/approvereject?id='+id+"&status="+status;
    return this.http.put<Lipamdogo>(url, {});
  }
  order(userid: number, productids: number[], totalcost: number) {
    console.log("order ", userid, productids, totalcost)
    const url = this.url+"/api/kilakitu/v1/order/save?userid="+userid+"&productid="+productids+"&totalcost="+totalcost;
    return this.http.post(url, {});
  }

  findPendingOrdersByUserId(id: number) {
    const url = this.url + '/api/kilakitu/v1/order/findAllByUserId?userid='+id;
    return this.http.get<Order[]>(url);
  }

  recoverPassword(email: string) {
    console.log(email);
    const url = this.url+"/api/rentpesa/v2/auth/recoverpassword?email="+email;
    return this.http.post(url, {});
  }

  findProductById(id: number) {
    const url = this.url + '/api/kilakitu/v1/product/findById?id='+id;
    return this.http.get<Product>(url);
  }

  findAllProperties() {
    const url = this.url + '/api/rentpesa/v2/property/findAll';
    return this.http.get<Property[]>(url);
  }

  findAllProducts() {
    const url = this.url + '/api/kilakitu/v1/product/findAll';
    return this.http.get<Product[]>(url);
  }

  findAllPropertiesPagination(page: number, size: number): Observable<PropertyDto> {
    const url = this.url + '/api/rentpesa/v2/property/findAllPagination?page='+page+'&size='+size;
    return this.http.get<PropertyDto>(url);
  }

  findAllPropertiesByType(type: string) {
    const url = this.url + '/api/rentpesa/v2/property/findAllByType/'+type;
    return this.http.get<Property[]>(url);
  }

  findAllPropertiesByTypeExcludingId(id: number, type: string) {
    const url = this.url + '/api/rentpesa/v2/property/findAllByTypeExcludingId?id='+id+"&type="+type;
    return this.http.get<Property[]>(url);
  }

  findAllPropertiesByLocation(latitude: string, longitude: string) {
    const url = this.url + '/api/rentpesa/v2/property/findAllByLocation/' + latitude + '/' + longitude;
    return this.http.get<Property[]>(url);
  }

  findAllPropertiesByLocationAndType(type: string, latitude: string, longitude: string) {
    const url = this.url + '/api/rentpesa/v2/property/findAllByLocationAndType/' + type + '/' + latitude + '/' + longitude;
    return this.http.get<Property[]>(url);
  }

  adminMetrics() {
    const url = this.url + '/api/kilakitu/v1/metrics/adminmetrics';
    return this.http.get<Metrics>(url);
  }

  userMetrics(id: number) {
    const url = this.url + '/api/rentpesa/v2/metrics/usermetrics?id='+id;
    return this.http.get<Metrics>(url);
  }

  deleteProperty(id: number) {
    const url = this.url + '/api/rentpesa/v2/property/delete?id='+id;
    return this.http.delete<Property>(url);
  }

  deleteUser(id: number) {
    const url = this.url + '/api/kilakitu/v1/user/delete?id='+id;
    return this.http.delete<Customer>(url);
  }

  editCategory(id: number, subCategory: string) {
    const url = this.url + '/api/kilakitu/v1/productcategory/edit?id='+id+'&subcategories='+subCategory;
    return this.http.put<Productcategory>(url,{});
  }

  editArticle(id: number, title: string, subtitle: string, description: string) {
    const url = this.url + '/api/kilakitu/v1/blog/edit?id='+id+'&title='+title+'&subtitle='+subtitle+'&description='+description;
    return this.http.put<Blog>(url,{});
  }

  deleteCategory(id: number, status: number) {
    const url = this.url + '/api/kilakitu/v1/productcategory/delete?id='+id+'&status='+status;
    return this.http.delete<Productcategory>(url);
  }

  deleteArticle(id: number, status: number) {
    const url = this.url + '/api/kilakitu/v1/blog/delete?id='+id+'&status='+status;
    return this.http.delete<Blog>(url);
  }

  savePropertyUnit(propertyfk: number, name: string, status: string) {
    const url = this.url + '/api/rentpesa/v2/propertyunit/save?propertyfk='+propertyfk+'&name='+name+'&status='+status;
    return this.http.post<PropertyUnit>(url, {});
  }

  editPropertyUnit(id: number, name: string, status: string) {
    const url = this.url + '/api/rentpesa/v2/propertyunit/edit?id='+id+'&name='+name+'&status='+status;
    return this.http.put<PropertyUnit>(url, {});
  }

  editProduct(id: number, name: string, category: string, subcategory: string, color: string, cost: number, rating: number, discount: number, quantity: number, description: string, about: string, classification: string) {
    const url = this.url + '/api/kilakitu/v1/product/edit?id='+id+'&name='+name+'&category='+category+"&subcategory="+subcategory+"&color="+color+"&cost="+cost+"&rating="+rating+"&discount="+discount+"&quantity="+quantity+"&description="+description+"&about="+about+"&classification="+classification;
    return this.http.put<Product>(url, {});
  }

  editProduct2(id: number, name: string, category: string, subcategory: string, color: string, brand: string, memory: string, storage: string, cost: number, rating: number, discount: number, quantity: number, description: string, about: string, classification: string) {
    // const url = this.url + '/api/kilakitu/v1/product/edit?id='+id+'&name='+name+'&category='+category+"&subcategory="+subcategory+"&color="+color+"&cost="+cost+"&rating="+rating+"&discount="+discount+"&quantity="+quantity+"&description="+description+"&about="+about+"&classification="+classification;
    const url = this.url + '/api/kilakitu/v1/product/edit'
    return this.http.put<Product>(url, {id: id, name: name, category: category, subcategory: subcategory, color: color, brand: brand, memory: memory, storage: storage, cost: cost, rating: rating, discount: discount, quantity: quantity, description: description, about: about, classification: classification});
  }

  copyProduct(id: number, name: string, category: string, subcategory: string, color: string, brand: string, memory: string, storage: string, cost: number, rating: number, discount: number, quantity: number, description: string, about: string, classification: string) {
    // const url = this.url + '/api/kilakitu/v1/product/edit?id='+id+'&name='+name+'&category='+category+"&subcategory="+subcategory+"&color="+color+"&cost="+cost+"&rating="+rating+"&discount="+discount+"&quantity="+quantity+"&description="+description+"&about="+about+"&classification="+classification;
    const url = this.url + '/api/kilakitu/v1/product/copy'
    return this.http.post<Product>(url, {id: id, name: name, category: category, subcategory: subcategory, color: color, brand: brand, memory: memory, storage: storage, cost: cost, rating: rating, discount: discount, quantity: quantity, description: description, about: about, classification: classification});
  }

  createCategory(category: string, subcategory: string) {
    const url = this.url + '/api/kilakitu/v1/productcategory/create?category='+category+'&subcategories='+subcategory;
    return this.http.post<Productcategory>(url, {});
  }

  editUser(id: number, name: string, email: string, phone: string) {
    const url = this.url + '/api/kilakitu/v1/user/edit?id='+id+'&name='+name+'&email='+email+"&phone="+phone;
    return this.http.put<Customer>(url, {});
  }

  productStatus(id: number, status: number) {
    const url = this.url + '/api/kilakitu/v1/product/status?id='+id+'&status='+status;
    return this.http.put<Product>(url, {});
  }

  deletePropertyUnit(id: number) {
    const url = this.url + '/api/rentpesa/v2/propertyunit/delete?id='+id;
    return this.http.post<PropertyUnit>(url, {});
  }

  createUser(data: any) {
    const url = this.url + '/api/kilakitu/v1/user/create';
    return this.http.post<PropertyUnit>(url, data);
  }

  findAllListings() {
    const url = this.url + '/api/rentpesa/v2/property/findAll';
    return this.http.get<Listing[]>(url);
  }

  findAllCategories() {
    const url = this.url + '/api/kilakitu/v1/productcategory/findAll';
    return this.http.get<Productcategory[]>(url);
  }

  findAllBlogs() {
    const url = this.url + '/api/kilakitu/v1/blog/findAll';
    return this.http.get<Blog[]>(url);
  }

  findAllOrderlogs() {
    const url = this.url + '/api/kilakitu/v1/order/orderlogs';
    return this.http.get<Orderlogs[]>(url);
  }

  findAllApprovedBlogs() {
    const url = this.url + '/api/kilakitu/v1/blog/findAllApproved';
    return this.http.get<Blog[]>(url);
  }

  findAllListingsById(id: number) {
    const url = this.url + '/api/rentpesa/v2/property/findAllById?id='+id;
    return this.http.get<Listing[]>(url);
  }

  findAllPayments() {
    const url = this.url + '/api/rentpesa/v2/payment/findAll';
    return this.http.get<Payment[]>(url);
  }

  findAllPaymentsById(id: number) {
    const url = this.url + '/api/rentpesa/v2/payment/findAllById?id='+id;
    return this.http.get<Payment[]>(url);
  }

  loadLandLordMetrics(email: string) {
    const url = this.url + '/api/rentpesa/property/landlordmetrics?email='+email;
    return this.http.get<Admindashboardmetrics>(url);
  }

  loadAdminMetrics() {
    const url = this.url + '/api/rentpesa/property/adminmetrics';
    return this.http.get<Admindashboardmetrics>(url);
  }

  loadUsersMetrics() {
    const url = this.url + '/api/rentpesa/user/usersmetrics';
    return this.http.get<Usersmetrics[]>(url);
  }

  findAllBookings() {
    const url = this.url + '/api/kilakitu/v1/order/findAll';
    return this.http.get<Booking[]>(url);
  }

  findAllCustomers() {
    const url = this.url + '/api/kilakitu/v1/user/findAllCustomers';
    return this.http.get<Customer[]>(url);
  }

  findAllUsers() {
    const url = this.url + '/api/kilakitu/v1/user/findAllUsers';
    return this.http.get<Customer[]>(url);
  }

  findAllBookingsById(id: number) {
    const url = this.url + '/api/rentpesa/v2/booking/findAllById?id='+id;
    return this.http.get<Booking[]>(url);
  }

  saveBooking(userfk: number, listingfk: number, propertyunitfk: number, amount: number, customermsisdn: string, hostmsisdn: string,
              status: string, paymenttag: string, unit: string, startdate: string, enddate: string) {
    const url = this.url+"/api/rentpesa/v2/booking/save?userfk="+userfk+"&listingfk="+listingfk+"&propertyunitfk="+propertyunitfk+"&amount="+amount+"&customermsisdn="+customermsisdn+"&hostmsisdn="+hostmsisdn+"&status="+status+"&unit="+unit+"&paymenttag="+paymenttag+"&startdate="+startdate+"&enddate="+enddate;
    console.log(url);
    return this.http.post(url, {});
  }


}
