import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navbarfixed:boolean = false;


  @HostListener('window:scroll', ['$event']) 
  onScroll() {
    if(window.scrollY > 75) {
      this.navbarfixed = true;
    } else {
      this.navbarfixed = false;
    }
  }
}
