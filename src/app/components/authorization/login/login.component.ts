import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  user: User | null = null;
  errorMessage: string | null = null;

  constructor(private router: Router, private userService: UserService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.userService.getUserByEmail(this.loginForm.value.email).subscribe(
      (user) => {
        // Handle successful response if needed
        console.log('User found:', user);
        this.router.navigate(['/']);
      },
      (error) => {
        // Handle error response
        console.error('Error:', error);
        // Example: Display error message to user
        if (error.status === 404) {
          this.errorMessage = 'User with that email does not exist';
        } else {
          this.errorMessage = 'An unexpected error occured'
        }
      }
    );
  }

}
