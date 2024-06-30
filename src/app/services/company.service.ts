import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Company } from '../model/Company';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    private apiUrl = `${environment.apiUrl}company`

    constructor(private http: HttpClient) { }

    getAllCompanies() : Observable<Company[]> {
        return this.http.get<Company[]>(`${this.apiUrl}/get/all`);
    }

    getCompanyByEmail(email: string, password: string) : Observable<Company> {
        const params = new HttpParams().set('email', email).set('password', password);

        return this.http.get<Company>(`${this.apiUrl}/get/one`, { params }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 404) {
                    console.error('Company with that email does not exist.');
                } else {
                    console.error('An unexpected error occurred:', error.error);
                }
                return throwError(() => error);
            })
        );
    }

    createCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(`${this.apiUrl}/create`, company);
    }

}