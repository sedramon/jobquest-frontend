import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../app.material.module';
import { HttpClient } from '@angular/common/http';
import { JobPost } from '../../../../model/JobPost';
import { JobPostService } from '../../../../services/jobpost.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-view-jobpost',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './detail-view-jobpost.component.html',
  styleUrl: './detail-view-jobpost.component.scss'
})
export class DetailViewJobpostComponent implements OnInit{
  jobPost!: JobPost;
  jobPostId!: string;

  constructor(private http: HttpClient, private jobPostService: JobPostService, private route: ActivatedRoute, private datePipe: DatePipe){
    this.route.params.subscribe(params => {
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
      error => {
        console.error('Error fetching job post details:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const formattedDate = this.datePipe.transform(dateString, 'dd.MM.yyyy');
    return formattedDate ?? 'Invalid date';
  }
  
}
