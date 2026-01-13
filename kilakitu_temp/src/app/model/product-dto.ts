import {Product} from "./product";

export interface ProductDto {
  products: Product[];
  elements: number;
  pages: number;
}
