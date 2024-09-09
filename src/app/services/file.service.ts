import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
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

    downloadDocument(fileId: string): Observable<HttpResponse<Blob>> {
      return this.http.get(`${this.apiUrl}/download/${fileId}`, {
        observe: 'response', // This will give you access to the full response, including headers
        responseType: 'blob'  // The response body will be of type Blob
      });
    }
}

export interface UploadedFile  {
    fileId: string;
    fileName: string;
    uploadDate: string;
    contentType: string;
}