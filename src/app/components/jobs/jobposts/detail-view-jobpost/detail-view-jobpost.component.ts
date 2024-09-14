import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../app.material.module';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { JobPost } from '../../../../model/JobPost';
import { JobPostService } from '../../../../services/jobpost.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';
import { ApplicationCreationData } from '../../../../model/Application';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService, UploadedFile } from '../../../../services/file.service';
import { HttpParams } from '@angular/common/http';

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
  currentUser: any = null;
  isCompany: boolean = false;
  userFiles: UploadedFile[] = [];  // Store the user's previously uploaded files
  selectedFileId: string = '';  // The ID of the selected file
  selectedFileBlob!: Blob;  // The actual file blob
  fileReady: boolean = false;  // Flag to enable "Apply Now" button
  alreadyApplied: boolean = false;

  constructor(
    private http: HttpClient,
    private jobPostService: JobPostService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private applicationService: ApplicationService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private router: Router,
  ) {
    this.route.params.subscribe((params) => {
      this.jobPostId = params['id'];
      this.getJobPostDetails(this.jobPostId);
    });
  }

  ngOnInit(): void {
    this.authService.userType$.subscribe(userType => {
      this.isCompany = userType === 'company';
    });

    const currentUser = this.authService.currentUserValue;

    if (this.authService.isLoginResponse(currentUser)) {
      // Fetch user's previously uploaded files
      this.fileService.getAllFilesByUserId(currentUser.user.id!).subscribe((files) => {
        this.userFiles = files;
      });

      // Check if the user already applied for this job
      this.applicationService.getAllApplicationsByUserId(currentUser.user.id!).subscribe((applications) => {
        applications.forEach((application) => {
          if (application.jobPost.id === this.jobPostId) {
            this.alreadyApplied = true;
          }
        });
      });
    }

    // Subscribe to currentUser changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isCompany = !!(this.currentUser && this.currentUser.pib); // Optional: company type check
    });
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

  onFileSelected(fileId: string): void {
    this.fileService.downloadDocument(fileId).subscribe((response) => {
      if (response.body) {
        // Convert the Blob into a File object to match the selectedFile format used in uploads
        const blob = response.body;
        const fileName = this.getFileNameFromResponse(response); // Extract the filename from the response headers
        const file = new File([blob], fileName, { type: blob.type });
  
        this.selectedFileBlob = file;  // Store the file as selectedFileBlob
        console.log("File downloaded and converted to File object successfully", this.selectedFileBlob);
      } else {
        console.error("File download failed: No content in the response.");
        this.snackBar.open('Error downloading file. No file content found.', 'Close', { duration: 3000 });
      }
    }, (error) => {
      console.error("Error downloading file", error);
      this.snackBar.open('Error downloading file. Please try again.', 'Close', { duration: 3000 });
    });
  }

  getFileNameFromResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition');
    const matches = /filename="([^"]*)"/.exec(contentDisposition || '');
    return matches && matches[1] ? matches[1] : 'downloaded-file'; // Fallback name if not found
  }

  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(dateString, 'dd.MM.yyyy');
    return formattedDate ?? 'Invalid date';
  }

  goBack(): void {
    this.router.navigate(['/jobs']); // Navigate to the job posts list route
  }

  sendApplication(): void {
    if (!this.selectedFileBlob) {
      this.snackBar.open('Please select a file to apply.', 'Close', { duration: 3000 });
      return;
    }
  
    if (!this.currentUser?.user?.id || !this.jobPostId) {
      this.snackBar.open('Invalid user or job post information.', 'Close', { duration: 3000 });
      return;
    }
  
    // Use the file name from the selected file in the user file list
    const selectedFileName = this.userFiles.find(file => file.fileId === this.selectedFileId)?.fileName || 'application-file';
  
    // Create a File object using the selected blob and name
    const selectedFile = new File([this.selectedFileBlob], selectedFileName, { type: this.selectedFileBlob.type });
  
    // Send the file for the job application
    this.fileService.uploadDocumentForApplication(selectedFile, this.currentUser.user.id, this.jobPostId).subscribe(
      (response) => {
        const application = {
          jobPost: { id: this.jobPostId },
          user: { id: this.currentUser.user.id }
        };
  
        this.applicationService.createApplication(application).subscribe(
          (response) => {
            this.snackBar.open('Application sent successfully!', 'Close', { duration: 3000 });
            this.alreadyApplied = true;
          },
          (error) => {
            this.snackBar.open('Error sending application. Please try again.', 'Close', { duration: 3000 });
          }
        );
      },
      (error) => {
        this.snackBar.open('Error sending application file. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }
  
}
