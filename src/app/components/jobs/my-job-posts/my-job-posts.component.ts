import { Component, OnInit } from '@angular/core';
import { JobPostService } from '../../../services/jobpost.service';
import { JobPost } from '../../../model/JobPost';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-my-job-posts',
  standalone: true,
  imports: [],
  templateUrl: './my-job-posts.component.html',
  styleUrl: './my-job-posts.component.scss'
})
export class MyJobPostsComponent implements OnInit {
  userId: string = '';
  myJobPosts: JobPost[] = [];

  constructor(private jobsService: JobPostService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    // Dobij trenutnog korisnika iz AuthenticationService
    this.authService.currentUser.subscribe(user => {
      if (this.authService.isCompany(user)) {
        this.userId = user.id;
      }
    })

    this.jobsService.getJobPostsByCompanyId(this.userId).subscribe(jobPosts => {
      this.myJobPosts = jobPosts;
      console.log(this.myJobPosts);
    })
    
  }
}
