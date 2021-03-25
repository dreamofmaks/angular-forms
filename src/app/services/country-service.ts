import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { switchMap, tap } from 'rxjs/operators';
import { CountryUrl } from "src/environments/environment";
import { Country } from '../models/country-model';

@Injectable({providedIn:'root'})
export class CountryService {

    readonly value$ = new BehaviorSubject<Country[]>([])

    constructor(private readonly http: HttpClient){}

    getCountries():Observable<Country[]> {
        return this.http.get(CountryUrl).pipe(
           tap((value: Country[]) => {
               this.value$.next(value)
           }),
           switchMap(() => this.value$.asObservable())
        )
    }
}