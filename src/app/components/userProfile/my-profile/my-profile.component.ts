import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { AuthenticationService } from '../../../services/authentication.service';
import { LoginResponse, UserService } from '../../../services/user.service';
import { Company } from '../../../model/Company';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../model/User';
import { CompanyService } from '../../../services/company.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  profilePictureUrl: SafeUrl | string = '/default-profile.png';
  selectedFile: File | null = null; 

  interests = [
    'IT', 'Marketing', 'Finance', 'Sales'
  ];
  

  constructor(private authService: AuthenticationService, private snackBar: MatSnackBar, private userService: UserService, private companyService: CompanyService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      
      if (this.authService.isCompany(user)) {
        // Now user is of type LoginResponse
        this.currentCompanyUser = user as Company;

        console.log(this.currentCompanyUser.id); // Access properties specific to LoginResponse
      } else {
        this.currentUser = user as LoginResponse;
        console.log(this.currentUser.user.id); // Access properties specific to Company
      }
    });

    this.loadProfilePicture();
  }

  // Method to update regular user profile
  updateProfile(): void {
    if(this.currentUser) {
      if(this.currentUser.user.dateOfBirth) {
        this.currentUser.user.dateOfBirth = new Date(this.currentUser.user.dateOfBirth).toISOString();
      }

      // Log the data being sent to the backend
      console.log('Sending data to API:', this.currentUser.user);

      this.userService.updateUser(this.currentUser.user).subscribe(
        (response: User) => {

          this.authService.updateCurrentUser({
            ...this.currentUser,
            user: response
          });

          console.log('API Response:', response);
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000
          });
        },
        (error) => {
          console.error('API Error:', error);
          this.snackBar.open('Failed to update profile', 'Close', {
            duration: 3000
          });
        }
      );
    } else if (this.currentCompanyUser) {
      console.log('Sending data to API:', this.currentCompanyUser);

      this.companyService.updateCompany(this.currentCompanyUser).subscribe(
        (response: Company) => {
          this.authService.updateCurrentUser({
            ...this.currentCompanyUser,
            id: response.id
          });

          console.log('API Response:', response);
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000
          });
        },
        (error) => {
          console.error('API Error:', error);
          this.snackBar.open('Failed to update profile', 'Close', {
            duration: 3000
          });
        }
      );
    }
  }

  // Method for selecting a profile picture (does not upload)
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.snackBar.open(`File "${file.name}" selected`, 'Close', { duration: 3000 });
    }
  }

 // Method to upload profile picture (after selecting)
 uploadProfilePicture(): void {
  if (this.currentUser?.user?.id && this.selectedFile) {
    this.userService.uploadProfilePicture(this.selectedFile, this.currentUser.user.id).subscribe(
      response => {
        this.loadProfilePicture();  // Reload the profile picture after successful upload
        this.snackBar.open('Profile picture updated successfully', 'Close', { duration: 3000 });
        this.selectedFile = null;  // Clear selected file after upload
      },
      error => {
        this.snackBar.open('Failed to update profile picture', 'Close', { duration: 3000 });
      }
    );
  }
}

  loadProfilePicture() {
    if (this.currentUser?.user?.id) {
      this.userService.getProfilePicture(this.currentUser.user.id).subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          this.profilePictureUrl = this.sanitizer.bypassSecurityTrustUrl(url);  // Sanitize URL
        },
        error => {
          this.snackBar.open('Failed to load profile picture', 'Close', { duration: 3000 });
        }
      );
    }
  }
 }

