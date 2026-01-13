import {Product} from "./product";

export interface Orderdetail {
  id: number;
  orderfk: number;
  productfk: number;
  product: Product;
}
