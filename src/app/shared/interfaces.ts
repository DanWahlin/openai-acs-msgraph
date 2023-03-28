export interface EmailSmsCompletion {
    email: string;
    sms: string;
    status: boolean;
}

export interface Customer {
    id: number;
    company: string;
    city: string;
    email: string;
}

export interface SmsResponse {
    status: boolean;
}