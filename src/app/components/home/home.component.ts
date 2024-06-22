import { Component } from '@angular/core';
import { MaterialModule } from '../../app.material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router){}

  redirectToJobs() {
    this.router.navigate(['/jobs']);
  }

}
