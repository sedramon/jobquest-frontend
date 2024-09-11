import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, catchError, map, throwError } from "rxjs";
import { User } from "../model/User";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}user`

    constructor(private http: HttpClient){}

    getAllUsers(): Observable<User[]>{
        return this.http.get<User[]>(`${this.apiUrl}/get/all`);
    }

    getUserByEmail(email: string, password: string): Observable<LoginResponse> {
        const params = new HttpParams().set('email', email).set('password', password);
      
        return this.http.get<LoginResponse>(`${this.apiUrl}/get/one`, { params }).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) {
              console.error("User with that email does not exist.");
            } else {
              console.error("An unexpected error occurred:", error.error);
            }
            return throwError(() => error);
          })
        );
      }

    createUser(user: User): Observable<User>{
        return this.http.post<User>(`${this.apiUrl}/create`, user);
    }

    updateUser(user: User): Observable<User>{
        return this.http.put<User>(`${this.apiUrl}/update`, user);
    }

    // Upload profile picture
    uploadProfilePicture(file: File, userId: string): Observable<any> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      return this.http.post<any>(`${this.apiUrl}/upload-profile-picture`, formData).pipe(
          catchError(this.handleError)
      );
  }

  // Get profile picture
  getProfilePicture(userId: string): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/get-profile-picture/${userId}`, { responseType: 'blob' }).pipe(
          catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
      console.error("An error occurred:", error.error);
      return throwError(() => error);
  }
}

export interface LoginResponse {
    user: User;
    token: string;
  }