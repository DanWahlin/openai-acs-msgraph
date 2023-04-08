export interface EmailSmsCompletion {
    emailSubject: string;
    emailBody: string;
    sms: string;
    status: boolean;
}

export interface Customer {
    id: number;
    company: string;
    city: string;
    email: string;
}

export interface EmailSmsResponse {
    status: boolean;
}