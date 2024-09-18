import { SafeUrl } from "@angular/platform-browser";
import { JobPost } from "./JobPost";
import { User } from "./User";

export interface jobPostId {
    id: string;
}

export interface userId {
    id: string;
}

export interface ApplicationCreationData {
    jobPost: jobPostId;
    user: userId;
}

export interface Application {
    id: string,
    jobPost: JobPost,
    user: User,
    profilePictureUrl: SafeUrl
}