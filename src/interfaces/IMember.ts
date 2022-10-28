import { EmployeeInterface } from "./IEmployee";
import {GendersInterface } from "./IGender";
import { ProvinceInterface } from "./IProvince";

export interface MemberInterface {
  ID?:          number;
  FirstName?:    string;
  LastName?:     string;
  Age?:          number;
  GenderID?:    number;
  Gender?:      GendersInterface;
  Date_Of_Birth?: Date | null;
  ProvinceID?:  number;
  Province?:    ProvinceInterface;
  Telephone?:    string;
  EmployeeID?:  number;
  Employee?:    EmployeeInterface;
}