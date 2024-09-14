import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";



@Injectable({
    providedIn: 'root'
})
export class FileService {
    private apiUrl = `${environment.apiUrl}files`;

    constructor(private http: HttpClient){}

    getAllFilesByUserId(userId: string) : Observable<UploadedFile[]> {
        return this.http.get<UploadedFile[]>(`${this.apiUrl}/user-files/${userId}`);
    }

    uploadDocument(file: File, userId: string): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('file', file);  // Use the native File object
      formData.append('userId', userId);  // Append the userId
    
      return this.http.post(`${this.apiUrl}/upload`, formData);
    }

    uploadDocumentForApplication(file: File, userId: string, jobPostId: string): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('file', file);  // Append the file to FormData
    
      // Create HttpParams for userId and jobPostId
      let params = new HttpParams();
      params = params.append('userId', userId);
      params = params.append('jobPostId', jobPostId);
    
      return this.http.post(`${this.apiUrl}/upload-application-file`, formData, { params });
    }
    
    

    downloadApplicationDocument(userId: string, jobPostId: string): Observable<HttpResponse<Blob>> {
      return this.http.get(`${this.apiUrl}/download/${userId}/${jobPostId}` ,{
        observe: 'response',
        responseType: 'blob'
      });
    }

    downloadDocument(fileId: string): Observable<HttpResponse<Blob>> {
      return this.http.get(`${this.apiUrl}/download/${fileId}`, {
        observe: 'response',
        responseType: 'blob'
      });
    }
}

export interface UploadedFile  {
    fileId: string;
    fileName: string;
    uploadDate: string;
    contentType: string;
}