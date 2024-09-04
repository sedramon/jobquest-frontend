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
}

export interface LoginResponse {
    user: User;
    token: string;
  }