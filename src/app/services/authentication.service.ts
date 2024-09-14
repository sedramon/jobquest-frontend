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

  private userTypeSubject: BehaviorSubject<'login' | 'company' | null> = new BehaviorSubject<'login' | 'company' | null>(null);
  public userType$: Observable<'login' | 'company' | null> = this.userTypeSubject.asObservable();

  constructor() {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') ?? 'null'));
    this.currentUser = this.currentUserSubject.asObservable();

    // Update the userTypeSubject when the currentUserSubject changes
    this.currentUser.subscribe(user => {
      if (this.isLoginResponse(user)) {
        this.userTypeSubject.next('login');
      } else if (this.isCompany(user)) {
        this.userTypeSubject.next('company');
      } else {
        this.userTypeSubject.next(null);
      }
    });
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
    return user && user.user && user.user.id !== undefined;
  }
  
  isCompany(user: any): user is Company {
    return user && user.id !== undefined;
  }

  isCurrentUserOfType(type: 'login' | 'company'): boolean {
    const user = this.currentUserValue;
    if (type === 'login') {
      return this.isLoginResponse(user);
    } else if (type === 'company') {
      return this.isCompany(user);
    }
    return false;
  }

}