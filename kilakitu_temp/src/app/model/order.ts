import {Orderdetail} from "./orderdetail";

export interface Order {
  id: number;
  userfk: number;
  productid: string;
  totalcost: number;
  status: number;
  orderdate: string;
  orderDetails: Orderdetail[];
}
