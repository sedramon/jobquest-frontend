import { Component, OnInit } from '@angular/core';
import { JobPostService } from '../../../services/jobpost.service';
import { JobPost } from '../../../model/JobPost';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../app.material.module';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ConfirmDeleteJobPostComponent } from '../../../dialogs/confirm-delete-job-post/confirm-delete-job-post.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-job-posts',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './my-job-posts.component.html',
  styleUrl: './my-job-posts.component.scss'
})
export class MyJobPostsComponent implements OnInit {
  userId: string = '';
  myJobPosts: JobPost[] = [];

  newJob: JobPostCreationData = {
    title: '',
    company: { companyName: '' },
    description: '',
    fieldOfWork: '',
    location: '',
    endsAt: ''
  };

  // Sample data for the dropdowns
  fieldsOfWork: string[] = ['IT', 'Marketing', 'Finance', 'Sales'];
  locations: string[] = ['Belgrade', 'Los Angeles', 'Chicago', 'San Francisco', 'California'];

  constructor(private jobsService: JobPostService, private authService: AuthenticationService, private router: Router, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit(): void {
    // Dobij trenutnog korisnika iz AuthenticationService
    this.authService.currentUser.subscribe(user => {
      if (this.authService.isCompany(user)) {
        this.userId = user.id;
        this.newJob.company.companyName = user.companyName;
      }
    })

    this.jobsService.getJobPostsByCompanyId(this.userId).subscribe(jobPosts => {
      this.myJobPosts = jobPosts;
      console.log(this.myJobPosts);
    })
    
  }

  truncateDescription(description: string, sentenceLimit: number): string {
    const sentences = description.split('. ');
    if (sentences.length <= sentenceLimit) return description;

    return sentences.slice(0, sentenceLimit).join('. ') + '...';
  }

   // Method to create a new job post
   createNewJobPost(): void {
    const endsAtDate = new Date(this.newJob.endsAt);
    const endsAtISO = this.formatDateToISOStringLocal(endsAtDate);
    this.newJob.endsAt = endsAtISO;
    console.log(this.newJob)
    this.jobsService.createJobPost(this.newJob).subscribe(
      (response) => {
        // Navigate to 'myjobs' after successful post creation
        this.snackBar.open('Job post created successfully', 'Close', { duration: 3000 });
        this.myJobPosts.push(response)
        this.newJob = {
          title: '',
          company: { companyName: '' },
          description: '',
          fieldOfWork: '',
          location: '',
          endsAt: ''
        };
      },
      (error) => {
        console.error('Failed to create job post', error);
      }
    );
  }

  goToDetail(jobPostId: string) { 
    this.router.navigate(['/myjobs', jobPostId]);
  }

  deleteJobPost(jobPost: JobPost): void {
    // Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDeleteJobPostComponent, {
      data: {
        title: jobPost.title
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // If the user confirmed, proceed with the deletion
        this.jobsService.deleteJobPost(jobPost.id).subscribe(() => {
          // Remove the job post from the list after successful deletion
          this.myJobPosts = this.myJobPosts.filter(jp => jp.id !== jobPost.id);
          this.snackBar.open('Job post deleted successfully', 'Close', { duration: 3000 });
        });
      }
    });
  }


  formatDateToISOStringLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
    // Return the date string in the "YYYY-MM-DDTHH:MM:SS.SSSZ" format, but with local time
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

}

export interface JobPostCreationData {
  title: string;
  company: {
    companyName: string;
  },
  description: string;
  fieldOfWork: string;
  location: string;
  endsAt: string;
}
