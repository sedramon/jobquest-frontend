import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private apiUrl = `${environment.apiUrl}files`;

    constructor(private http: HttpClient){}

    getAllFilesByUserId(userId: string) : Observable<File[]> {
        return this.http.get<File[]>(`${this.apiUrl}/user-files/${userId}`);
    }

    uploadDocument(file: File, userId: string): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('file', file.fileName);  // Append the file
        formData.append('userId', userId);  // Append the userId
    
        // Make the HTTP request to upload the file
        return this.http.post(`${this.apiUrl}/upload`, formData, {
          headers: new HttpHeaders({
            'enctype': 'multipart/form-data'
          })
        });
      }
}

export interface File {
    fileId: string;
    fileName: string;
    uploadDate: string;
    contentType: string;
}