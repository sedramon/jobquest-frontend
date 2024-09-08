import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../app.material.module';
import { File, FileService } from '../../../services/file.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { LoginResponse } from '../../../services/user.service';
import { Company } from '../../../model/Company';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './my-documents.component.html',
  styleUrl: './my-documents.component.scss'
})
export class MyDocumentsComponent implements OnInit {
  userDocuments: File[] = [];
  currentUser: LoginResponse | null = null;

  constructor(private fileService: FileService, private authenticationService: AuthenticationService) {
    
  }

  

  ngOnInit(): void {
    // Dobij trenutnog korisnika iz AuthenticationService
    const currentUser = this.authenticationService.currentUserValue;
  
    // Proveri tip korisnika koristeći Type Guards
    let userId: string | null = null;
  
    if (this.authenticationService.isLoginResponse(currentUser)) {
      userId = currentUser.user.id; 
    } else if (this.authenticationService.isCompany(currentUser)) {
      userId = currentUser.id; 
    }
  
    if (userId) {

      this.fileService.getAllFilesByUserId(userId).subscribe(files => {
        this.userDocuments = files;
        console.log(this.userDocuments);
        console.log('first');
      });
    } else {
      console.log("User is not logged in or userId is not available.");
    }
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileService
    }
  }

}
