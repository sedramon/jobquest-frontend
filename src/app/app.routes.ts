import { Routes } from '@angular/router';
import { LoginComponent } from './components/authorization/login/login.component';
import { JobpostsComponent } from './components/jobs/jobposts/jobposts.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { DetailViewJobpostComponent } from './components/jobs/jobposts/detail-view-jobpost/detail-view-jobpost.component';
import { SignupComponent } from './components/authorization/signup/signup.component';
import { SignupCompanyComponent } from './components/authorization/signup-company/signup-company.component';
import { MyJobPostsComponent } from './components/jobs/my-job-posts/my-job-posts.component';
import { MyDocumentsComponent } from './components/userProfile/my-documents/my-documents.component';
import { MyApplicationsComponent } from './components/userProfile/my-applications/my-applications.component';
import { MyProfileComponent } from './components/userProfile/my-profile/my-profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    {path: 'loginCompany', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'signupCompany', component: SignupCompanyComponent},
    { path: 'jobs', component: JobpostsComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'companies', component: CompaniesComponent},
    {path: 'jobs/:id', component: DetailViewJobpostComponent},
    {path: 'myjobs', component: MyJobPostsComponent},
    {path: 'my-documents', component: MyDocumentsComponent},
    {path: 'my-applications', component: MyApplicationsComponent},
    {path: 'profile', component: MyProfileComponent},
];
