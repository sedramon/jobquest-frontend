import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../services/company.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.activatedRoute.url.subscribe(url => {
      const path = url[0]?.path; // Assuming it's a direct route, adjust if it's nested
      this.currentRoute = path; // Assign the extracted segment to the variable
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      if(this.currentRoute === 'login'){
        this.userService.getUserByEmail(this.loginForm.value.email, this.loginForm.value.password).subscribe(
          (response) => {
            // Handle successful response if needed
            console.log('User found:', response.user.email);
            this.authService.login(response);
            this.router.navigate(['/']);
          },
          (error) => {
            // Handle error response
            console.error('Error:', error);
            // Example: Display error message to user
            if (error.status === 404) {
              this.errorMessage = 'User with that email or password does not exist';
            } else {
              this.errorMessage = 'An unexpected error occured';
            }
          }
        );
      } else if (this.currentRoute === 'loginCompany') {
        this.companyService.getCompanyByEmail(this.loginForm.value.email, this.loginForm.value.password).subscribe(
          (company) => {
            // Handle successful response if needed
            console.log('Company found:', company.email);
            this.authService.login(company);
            this.router.navigate(['/']);
          },
          (error) => {
            // Handle error response
            console.error('Error:', error);
            // Example: Display error message to user
            if (error.status === 404) {
              this.errorMessage = 'Company with that email or password does not exist';
            } else {
              this.errorMessage = 'An unexpected error occured';
            }
          }
        );
      } 
    } else {
      this.errorMessage = 'Please fill in all fields in the correct format!';
    }
  }
}
