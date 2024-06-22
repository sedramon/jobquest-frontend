import { Routes } from '@angular/router';
import { LoginComponent } from './components/authorization/login/login.component';
import { JobpostsComponent } from './components/jobs/jobposts/jobposts.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'jobs', component: JobpostsComponent},
];
