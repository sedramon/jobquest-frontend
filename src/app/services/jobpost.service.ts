import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { JobPost } from "../model/JobPost";

@Injectable({
    providedIn: 'root'
})
export class JobPostService {
    private apiUrl = `${environment.apiUrl}jobpost`

    constructor(private http: HttpClient){}

    getAllJobPosts(): Observable<JobPost[]>{
        return this.http.get<JobPost[]>(`${this.apiUrl}/get/all`)
    }


}
