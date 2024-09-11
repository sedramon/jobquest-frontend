import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { AuthenticationService } from '../../../services/authentication.service';
import { LoginResponse } from '../../../services/user.service';
import { Company } from '../../../model/Company';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../model/Application';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.scss'
})
export class MyApplicationsComponent implements OnInit {
  userId: string = '';
  currentUser: LoginResponse | Company | null = null;
  applications: Application[] = [];


  constructor(
    private authenticationService: AuthenticationService,
  private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    })


    if (this.authenticationService.isLoginResponse(this.currentUser)) {
      this.userId = this.currentUser.user.id;
    } else if (this.authenticationService.isCompany(this.currentUser)) {
      this.userId = this.currentUser.id;
    }

    this.applicationService.getAllApplicationsByUserId(this.userId).subscribe(applications => {
      this.applications = applications;
      console.log(applications)
    })
  }

  truncateDescription(description: string, sentenceLimit: number): string {
    const sentences = description.split('. ');
    if (sentences.length <= sentenceLimit) return description;

    return sentences.slice(0, sentenceLimit).join('. ') + '...';
  }
}
