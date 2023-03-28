import { EmailSmsCompletion } from "../shared/interfaces";

export interface EmailSmsDialogData {
  title: string;
  prompt: string;
  customerPhoneNumber: string;
  company: string;
  contactName: string;
  email: string;
  data?: EmailSmsCompletion;
}