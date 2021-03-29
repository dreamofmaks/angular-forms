import { Address } from '../models/address-model';
import { Password } from '../models/password-model';

export default interface User {
    id?: number
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    addressId?: number,
    email?: string,
    password?: Password
    token?: string,
    address: Address
  }