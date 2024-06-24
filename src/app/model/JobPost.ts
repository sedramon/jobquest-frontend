import { CompanyInfo } from "./Company";

export interface JobPost {
    id: string,
    title: string,
    company: CompanyInfo,
    description: string,
    fieldOfWork: string,
    location: string,
    endsAt: string
}