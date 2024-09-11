import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { AuthenticationService } from '../../../services/authentication.service';
import { LoginResponse } from '../../../services/user.service';
import { Company } from '../../../model/Company';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit{
  currentUser: LoginResponse | null = null;
  currentCompanyUser: Company | null = null;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      
      if (this.authService.isLoginResponse(user)) {
        // Now user is of type LoginResponse
        this.currentUser = user as LoginResponse;
        console.log(this.currentUser.user); // Access properties specific to LoginResponse
      } else {
        this.currentCompanyUser = user as Company;
        console.log(this.currentCompanyUser.id); // Access properties specific to Company
      }
    });
  }

  // Method to update regular user profile
  updateProfile(): void {
    if (this.currentUser) {
      console.log('Updated user profile:', this.currentUser);
      // Call service to update user profile
    }
  }

}
