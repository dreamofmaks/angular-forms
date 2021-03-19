import { City } from '../models/city-model';
import { Country } from '../models/country-model';
 
export interface Address {
    id?: number,
    countryId?: number,
    country: Country,
    cityId?: number,
    city: City,
    street: string,
    building: number
}