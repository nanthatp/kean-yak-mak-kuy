import { EmployeeInterface } from "./IEmployee";
import {CartInterface } from "./ICart";
import { PaymentTypeInterface } from "./IPaymentType";
import { MemberInterface } from "./IMember";


export interface ReceiptInterface {
  ID?:          number;

  CartID?: number;
  Cart?:   CartInterface;

  ReceiptSum?:   number;

  PaymenttypeID?: number;
  Paymenttype?:   PaymentTypeInterface;

  MemberID?: number;
  Member?:   MemberInterface;

  ReceiptPaymentAmount?: number;
  ReceiptChange?:        number;

  EmployeeID?: number;
  Employee?:   EmployeeInterface;
  
  ReceiptTime?: Date | null;
}