import { Address } from '../models/address-model';

export default interface User {
    id?: number
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    addressId?: number,
    address: Address
  }