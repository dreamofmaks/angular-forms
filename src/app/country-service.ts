import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { CountryUrl } from "src/environments/environment";
import { Country } from './user-service';

@Injectable({providedIn:'root'})
export class CountryService {

    private countries: Country[] = [];

    readonly value$ = new BehaviorSubject<Country[]>(this.countries)

    constructor(private readonly http: HttpClient){}

    getCountries():Observable<Country[]> {
        return this.http.get(CountryUrl).pipe(
           tap((value: Country[]) => {
               this.value$.next(value)
           })
        )
    }
}