import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { FileService, UploadedFile } from '../../../services/file.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { LoginResponse } from '../../../services/user.service';
import { Company } from '../../../model/Company';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './my-documents.component.html',
  styleUrl: './my-documents.component.scss'
})
export class MyDocumentsComponent implements OnInit {
  userDocuments: UploadedFile[] = [];
  userId: string = '';
  currentUser: LoginResponse | Company | null = null;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(private fileService: FileService, private authenticationService: AuthenticationService, private snackBar: MatSnackBar) {

  }



  ngOnInit(): void {
    // Dobij trenutnog korisnika iz AuthenticationService
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    })


    if (this.authenticationService.isLoginResponse(this.currentUser)) {
      this.userId = this.currentUser.user.id;
    } else if (this.authenticationService.isCompany(this.currentUser)) {
      this.userId = this.currentUser.id;
    }

    if (this.userId) {
      this.fileService.getAllFilesByUserId(this.userId).subscribe(files => {
        this.userDocuments = files;
        console.log(this.userDocuments);
      });
    } else {
      console.log('User is not logged in or userId is not available.');
    }
  }


  // When a file is selected
  onFileSelected(event: any): void {
    const file = event.target.files[0];  // This is the native File object

    if (file) {
      this.selectedFile = file;  // Assign it directly
      this.selectedFileName = file.name;
      console.log('File selected:', this.selectedFile);  // Check if the file is selected
    } else {
      console.log('No file selected');
    }
  }

  deleteDocument(fileId: string): void {
    this.fileService.deleteFile(fileId).subscribe(() => {
      // Update the userDocuments list by reassigning the filtered list
      this.userDocuments = this.userDocuments.filter((file) => file.fileId !== fileId);
  
      // Show success snackbar
      this.snackBar.open('File deleted successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }


  onUpload(): void {
    if (this.selectedFile && this.userId) {
      console.log('Uploading file:', this.selectedFile);  // Check if file is selected
      console.log('User ID:', this.userId);  // Check if userId is available

      this.fileService.uploadDocument(this.selectedFile, this.userId).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);  // Success response

          // Show success snackbar
          this.snackBar.open('File uploaded successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Update the userDocuments list with the new file
          this.fileService.getAllFilesByUserId(this.userId).subscribe(files => {
            this.userDocuments = files;
          });

          // Clear the selected file
          this.selectedFile = null;
          this.selectedFileName = null;
        },
        (error) => {
          console.error('Error uploading file:', error);  // Error response

          // Show error snackbar
          this.snackBar.open('Error uploading file. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
    } else {
      console.log('No file selected or user is not logged in');
    }
  }

  onDownload(fileId: string): void {
    this.fileService.downloadDocument(fileId).subscribe((response: HttpResponse<Blob>) => {
      const blob = response.body; // Get the blob from the response body
  
      if (blob) {  // Ensure the blob is not null
        const contentDisposition = response.headers.get('content-disposition');
        const fileName = this.getFileNameFromContentDisposition(contentDisposition); // Extract the file name
      
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;  // Use the extracted file name
        a.click();
        window.URL.revokeObjectURL(url);  // Clean up URL object
      } else {
        console.error('Blob is null. Cannot download the file.');
        this.snackBar.open('Error downloading file. File data is unavailable.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    }, error => {
      console.error('Error downloading file:', error);
      this.snackBar.open('Error downloading file. Please try again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }
  
  
  getFileNameFromContentDisposition(contentDisposition: string | null): string {
    if (contentDisposition) {
      const matches = /filename="(.+?)"/.exec(contentDisposition);
      return (matches && matches[1]) ? matches[1] : 'downloadedFile';
    }
    return 'downloadedFile';
  }
}


