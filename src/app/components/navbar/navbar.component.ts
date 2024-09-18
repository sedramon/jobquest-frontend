import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MaterialModule } from '../../app.material.module';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  navbarfixed: boolean = false;
  currentUser: any = null;
  currentUserName: string = '';
  isCompany: boolean = false;
  profilePictureUrl: SafeUrl | string = '/default-profile.png';

  constructor(private authService: AuthenticationService, private router: Router, private cdr: ChangeDetectorRef, private userService: UserService, private sanitizer: DomSanitizer, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Subscribe to the currentUser observable from the authentication service
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      // Check if the user is a company (has a 'pib' field)
      this.isCompany = !!(this.currentUser && this.currentUser.pib);
      
      console.log(this.currentUserName);
      // Manually trigger change detection if needed
      this.cdr.detectChanges();
    });

    this.loadProfilePicture();
  }

  loadProfilePicture() {
    if (this.currentUser?.user?.id) {
      this.userService.getProfilePicture(this.currentUser.user.id).subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          this.profilePictureUrl = this.sanitizer.bypassSecurityTrustUrl(url);  // Sanitize URL
        },
        error => {
          this.snackBar.open('Failed to load profile picture', 'Close', { duration: 3000 });
        }
      );
    }
  }

  goToDocuments(): void {
    this.router.navigate(['/my-documents']);
  }

  goToApplications(): void {
    this.router.navigate(['/my-applications']);
  }

  goToMyJobs(): void {
    this.router.navigate(['/myjobs']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (window.scrollY > 100) {
      this.navbarfixed = true;
    } else {
      this.navbarfixed = false;
    }
  }
}
