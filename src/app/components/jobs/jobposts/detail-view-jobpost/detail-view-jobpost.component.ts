import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../app.material.module';
import { HttpClient } from '@angular/common/http';
import { JobPost } from '../../../../model/JobPost';
import { JobPostService } from '../../../../services/jobpost.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';
import { ApplicationCreationData } from '../../../../model/Application';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail-view-jobpost',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './detail-view-jobpost.component.html',
  styleUrl: './detail-view-jobpost.component.scss',
})
export class DetailViewJobpostComponent implements OnInit {
  jobPost!: JobPost;
  jobPostId!: string;

  alreadyApplied: boolean = false;

  constructor(
    private http: HttpClient,
    private jobPostService: JobPostService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private applicationService: ApplicationService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.jobPostId = params['id'];
      this.getJobPostDetails(this.jobPostId);
    });
  }

  ngOnInit(): void {
    console.log(this.authService.currentUserValue);
    this.applicationService.getAllApplicationsByUserId(this.authService.currentUserValue.user.id!).subscribe((applications) => {
      console.log(applications)
      applications.forEach((application) => {
        if(application.jobPost.id == this.jobPostId) {
          this.alreadyApplied = true;
        }
      })
      console.log(this.alreadyApplied)
    })
  }

  getJobPostDetails(id: string): void {
    this.jobPostService.getJobPostById(id).subscribe(
      (jobPost: JobPost) => {
        this.jobPost = jobPost;
      },
      (error) => {
        console.error('Error fetching job post details:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(dateString, 'dd.MM.yyyy');
    return formattedDate ?? 'Invalid date';
  }

  goBack(): void {
    this.router.navigate(['/jobs']); // Navigate to the job posts list route
  }

  sendApplication(): void {
    if(this.authService.currentUserValue == null) {
      const snackBarRef = this.snackBar.open('You need to log in to apply.', 'Login', {
        duration: 2000,
      });

      const returnUrl = this.router.url;

      snackBarRef.onAction().subscribe(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl } });
      });
    } else {
      let application: ApplicationCreationData = {
        jobPost: {id: this.jobPostId},
        user: {id: this.authService.currentUserValue.user.id!},
      };
      this.applicationService.createApplication(application).subscribe(
        (response) => {
          // Show success snackbar
          this.snackBar.open('Application sent successfully!', 'Close', {
            duration: 3000, // Display duration for 3 seconds
          });
          this.alreadyApplied = true;
        },
        (error) => {
          // Handle error and show an error snackbar
          this.snackBar.open('Error sending application. Please try again.', 'Close', {
            duration: 3000,
          });
          console.error('Error sending application:', error);
        }
      );
    }    
  }
}
