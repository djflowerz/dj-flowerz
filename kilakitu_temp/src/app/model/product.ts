import {Productimages} from "./productimages";

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  color: string;
  dimensions: string;
  description: string;
  location: string;
  coverimage: string;
  weight: number;
  cost: number;
  discount: number;
  rating: number;
  quantity: number;
  status: number;
  dealstatus: number;
  productImages: Productimages[];
}
