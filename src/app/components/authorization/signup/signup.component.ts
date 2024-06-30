import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../model/User';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const user: User = this.signupForm.value;

      this.userService.createUser(user).subscribe(
        (user) => {
          console.log('User created:', user.firstName + ' ' + user.lastName);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error:', error);
          if (error.status === 409) {
            this.errorMessage = 'User with that email already exists';
          } else {
            this.errorMessage = 'An unexpected error occured';
          }
        }
      );
    } else {
      this.errorMessage = 'Please fill all the fields in the right format!';
    }
  }
}
