import {Productsubcategory} from "./productsubcategory";

export interface Productcategory {
  id: number;
  name: string;
  productSubCategories: Productsubcategory[];
}
