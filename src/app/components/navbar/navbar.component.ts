import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MaterialModule } from '../../app.material.module';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

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
  isCompany: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Subscribe to the currentUser observable from the authentication service
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      // Check if the user is a company (has a 'pib' field)
      this.isCompany = !!(this.currentUser && this.currentUser.pib);

      // Manually trigger change detection if needed
      this.cdr.detectChanges();
    });


  }

  goToDocuments(): void {
    this.router.navigate(['/my-documents']);
  }

  goToApplications(): void {
    this.router.navigate(['/my-applications']);
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
