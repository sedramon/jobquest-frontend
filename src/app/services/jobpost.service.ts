import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { JobPost } from "../model/JobPost";
import { JobPostCreationData } from "../components/jobs/my-job-posts/my-job-posts.component";

@Injectable({
    providedIn: 'root'
})
export class JobPostService {
    private apiUrl = `${environment.apiUrl}jobpost`

    constructor(private http: HttpClient){}

    getAllJobPosts(): Observable<JobPost[]>{
        return this.http.get<JobPost[]>(`${this.apiUrl}/get/all`)
    }

    getJobPostById(jobPostId: string): Observable<JobPost>{
        const params = new HttpParams().set('jobPostId', jobPostId)
        return this.http.get<JobPost>(`${this.apiUrl}/get/one`, {params});
    }

    getJobPostsByCompanyId(companyId: string): Observable<JobPost[]>{
        const params = new HttpParams().set('companyId', companyId)
        return this.http.get<JobPost[]>(`${this.apiUrl}/${companyId}/jobposts`, {params});
    }

    createJobPost(jobPost: JobPostCreationData): Observable<JobPost>{
        return this.http.post<JobPost>(`${this.apiUrl}/create`, jobPost);
    }

    deleteJobPost(jobPostId: string): Observable<JobPost>{
        const params = new HttpParams().set('jobPostId', jobPostId)
        return this.http.delete<JobPost>(`${this.apiUrl}/delete`, {params});
    }

    updateJobPost(jobPost: JobPost): Observable<JobPost>{
        return this.http.put<JobPost>(`${this.apiUrl}/update`, jobPost);
    }


}
