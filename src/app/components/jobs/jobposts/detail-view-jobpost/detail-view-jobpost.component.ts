import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../app.material.module';
import { HttpClient } from '@angular/common/http';
import { JobPost } from '../../../../model/JobPost';
import { JobPostService } from '../../../../services/jobpost.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';
import { ApplicationCreationData } from '../../../../model/Application';
import { AuthenticationService } from '../../../../services/authentication.service';

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

  constructor(
    private http: HttpClient,
    private jobPostService: JobPostService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private applicationService: ApplicationService,
    private authService: AuthenticationService
  ) {
    this.route.params.subscribe((params) => {
      this.jobPostId = params['id'];
      this.getJobPostDetails(this.jobPostId);
    });
  }

  ngOnInit(): void {}

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

  sendApplication(): void {
    let currentUser = this.authService.currentUserValue;
    if(currentUser.user === undefined) {
      console.log('Please login to apply for this post!')
    } else {
      let application: ApplicationCreationData = {
        jobPost: {id: this.jobPostId},
        user: {id: currentUser.user.id!},
      };
      this.applicationService.createApplication(application).subscribe(
        (response) => {
          console.log('Application sent:', response);
        },
        (error) => {
          console.error('Error sending application:', error);
        }
      );
    }    
  }
}
