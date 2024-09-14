import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Application, ApplicationCreationData } from '../model/Application';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private apiUrl = `${environment.apiUrl}application`

    constructor(private http: HttpClient) { }

    createApplication(application: ApplicationCreationData) : Observable<Application> {
        return this.http.post<Application>(`${this.apiUrl}/create`, application).pipe(
            tap(() => console.log(application))
        );
    }

    getAllApplications(): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}/get/all`);
    }

    getAllApplicationsByUserId(params: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}/${params}/applications/user`);
    }
    // Add your service methods here

    getAllApplicationsByJobPostId(params: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}/${params}/applications/jobpost`);
    }

    createApplicationWithFile(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, formData).pipe(
            tap(() => console.log('Application with file sent:', formData))
        );
    }

}