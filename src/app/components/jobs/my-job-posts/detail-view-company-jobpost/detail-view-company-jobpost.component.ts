import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JobPostService } from '../../../../services/jobpost.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ApplicationService } from '../../../../services/application.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobPost } from '../../../../model/JobPost';
import { MaterialModule } from '../../../../app.material.module';
import { Application } from '../../../../model/Application';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../../../services/file.service';

@Component({
  selector: 'app-detail-view-company-jobpost',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './detail-view-company-jobpost.component.html',
  styleUrl: './detail-view-company-jobpost.component.scss'
})
export class DetailViewCompanyJobpostComponent implements OnInit {
  jobPost!: JobPost;
  jobPostId!: string;

  hasChanged: boolean = false;

  applications: Application[] = [];

  // Sample data for the dropdowns
  fieldsOfWork: string[] = ['IT', 'Marketing', 'Finance', 'Sales'];
  locations: string[] = ['Belgrade', 'Los Angeles', 'Chicago', 'San Francisco', 'California'];

  constructor(
    private jobPostService: JobPostService,
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.jobPostId = params['id'];
      this.getJobPostDetails(this.jobPostId);
    });
   }

  ngOnInit(): void {
    this.applicationService.getAllApplicationsByJobPostId(this.jobPostId).subscribe(
      (applications: Application[]) => {
        this.applications = applications;
        console.log(this.applications)
      },
      (error) => {
        console.error('Error fetching applications:', error);
      }
    )
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

  updateJobPost(jobPost: JobPost): void {
    this.jobPostService.updateJobPost(jobPost).subscribe(
      (updatedJobPost: JobPost) => {
        this.jobPost = updatedJobPost;
        this.snackBar.open('Job post updated successfully', 'Close', {
          duration: 3000
        });
      },
      (error) => {
        console.error('Error updating job post:', error);
      }
    );
  }

  goBack(){
    this.router.navigate(['/myjobs']);
  }

  downloadCv(userId: string, jobPostId: string): void {
    this.fileService.downloadApplicationDocument(userId, jobPostId).subscribe((response) => {
      const blob = response.body;
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Set the download filename from the response headers or use a fallback name
        const contentDisposition = response.headers.get('content-disposition');
        const matches = /filename="([^"]*)"/.exec(contentDisposition || '');
        const filename = matches && matches[1] ? matches[1] : 'downloaded-cv';

        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);  // Clean up the URL after the download
      }
    }, (error) => {
      console.error("Error downloading CV", error);
      this.snackBar.open('Error downloading CV. Please try again.', 'Close', { duration: 3000 });
    });
  }
}
