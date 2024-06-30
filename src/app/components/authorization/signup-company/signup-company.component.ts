import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-company',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './signup-company.component.html',
  styleUrl: './signup-company.component.scss',
})
export class SignupCompanyComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      companyName: ['', [Validators.required]],
      companyAddress: ['', [Validators.required]],
      companyPhone: [''],
      activity: ['', [Validators.required]],
      mb: ['', [Validators.required]],
      pib: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if(this.signupForm.valid){
      const company = this.signupForm.value;

      console.log('Company created:', company.companyName);
      this.router.navigate(['/loginCompany']);
    } else {
      this.errorMessage = 'Please fill all the fields in the right format!';
    }
  }
}
