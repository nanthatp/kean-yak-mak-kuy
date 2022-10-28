import { CartInterface } from "./ICart";
import { ProductInterface } from "./IProduct";


export interface OrderInterface {
    ID?:	number;
    Product_quantity?:	number;
	ProductID?:	number;
	Product?:	ProductInterface;
	CartID?:	number;
	Cart?:	CartInterface;
}