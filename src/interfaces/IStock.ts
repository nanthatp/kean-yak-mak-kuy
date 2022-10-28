import { LotsInterface } from "./ILot";
import { ShelfproductInterface } from "./IShelfproduct";
import { ProductInterface } from "./IProduct";
import { EmployeeInterface } from "./IEmployee";

export interface StockInterface {
  ID?: number;

  ProductID?: number;
  Product?: ProductInterface;

  Stock_quantity?: number;

  ShelfproductID?: number;
  Shelfproduct?: ShelfproductInterface;

  LotID?: number;
  Lot?: LotsInterface;

  EmployeeID?: number;
  Employee?: EmployeeInterface;

  }