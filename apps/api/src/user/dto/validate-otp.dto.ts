export class ValidateOtpDto {
  email: string;
  purpose: 'register' | 'password_reset';
  otp: string;
}