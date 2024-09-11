import { Component, OnInit } from '@angular/core';
import { JobPost } from '../../../model/JobPost';
import { JobPostService } from '../../../services/jobpost.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../app.material.module';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { LoginResponse } from '../../../services/user.service';
import { Company } from '../../../model/Company';
import { AuthenticationService } from '../../../services/authentication.service';
import { ApplicationService } from '../../../services/application.service';
import { Application } from '../../../model/Application';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jobposts',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatChipsModule, FormsModule],
  templateUrl: './jobposts.component.html',
  styleUrl: './jobposts.component.scss'
})
export class JobpostsComponent implements OnInit{
    jobPosts: JobPost[] = [];
    userId: string = '';
    currentUser: LoginResponse | Company | null = null;
    applications: Application[] = [];
    searchTerm: string = '';
    filteredJobPosts: JobPost[] = []; // Search term for the input field
    fieldOfWork: string = ''; // Filter for field of work
    location: string = ''; // Filter for location
    company: string = ''; // Filter for company
    showFilters: boolean = false; // Control the display of the filters section


    // Sample data for the dropdowns
    fieldsOfWork: string[] = ['IT', 'Marketing', 'Finance', 'Sales'];
    locations: string[] = ['Belgrade', 'Los Angeles', 'Chicago', 'San Francisco'];
    companies: string[] = ['Google', 'Amazon', 'Facebook', 'Microsoft', 'Apple', 'Gigatron', 'Gevekom'];

    constructor(private jobPostService: JobPostService, private router: Router, private authenticationService: AuthenticationService, private applicationService: ApplicationService){}

  ngOnInit(): void {
      this.jobPostService.getAllJobPosts().subscribe((response) => {
        this.jobPosts = response;
        this.filteredJobPosts = response;
      })

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

  apply(jobPostId: string) {
    this.router.navigate(['/jobs', jobPostId])
  }

  onSearch(): void {
    this.filteredJobPosts = this.jobPosts.filter(jobPost =>
        jobPost.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        jobPost.company.companyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        jobPost.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        jobPost.fieldOfWork.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
}

toggleFilters() {
  this.showFilters = !this.showFilters; // Toggle the visibility of the filter section
}

onFilter(): void {
  this.filteredJobPosts = this.jobPosts.filter(jobPost => {
      const matchesTitle = this.searchTerm ? jobPost.title.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
      const matchesFieldOfWork = this.fieldOfWork ? jobPost.fieldOfWork.toLowerCase() === this.fieldOfWork.toLowerCase() : true;
      const matchesLocation = this.location ? jobPost.location.toLowerCase().includes(this.location.toLowerCase()) : true;
      const matchesCompany = this.company ? jobPost.company.companyName.toLowerCase().includes(this.company.toLowerCase()) : true;

      return matchesTitle && matchesFieldOfWork && matchesLocation && matchesCompany;
  });
}

  truncateDescription(description: string, sentenceLimit: number): string {
    const sentences = description.split('. ');
    if (sentences.length <= sentenceLimit) return description;

    return sentences.slice(0, sentenceLimit).join('. ') + '...';
  }

  checkIfApplied(jobPostId: string): boolean {
    return this.applications.some(application => application.jobPost.id === jobPostId);
  }
}
