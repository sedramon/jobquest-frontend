import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from './user.service';
import { Company } from '../model/Company';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<LoginResponse | Company | null>;
  public currentUser: Observable<LoginResponse | Company | null>;

  constructor() {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') ?? 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(user: any) {
    // Assuming `user` contains the token and user details
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

   // Update local storage and current user
   updateCurrentUser(updatedUser: any): void {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoginResponse(user: any): user is LoginResponse {
    return user && (user as LoginResponse).user.id !== undefined;
  }
  
  // Proverava da li je korisnik tipa Company
  isCompany(user: any): user is Company {
    return user && (user as Company).id !== undefined;
  }

}