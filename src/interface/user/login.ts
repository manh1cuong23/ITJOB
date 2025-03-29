/** user's role */
export type Role = 'guest' | 'admin';

// Login
export interface ILoginParams {
  password: string;
  username: string;
}


export interface ILoginForm {
  username: string;
  password: string;
}


export interface ILoginResult {
  success: boolean;
  data: ILoginResultData;
  errorData: ErrorData;
}

export interface ILoginResultData {
  user_id: number;
  user_context: IUserContext;
  company_id: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}
export interface IUserContext {
  lang: string;
  tz: string;
  uid: number;
}
export interface ErrorData {}

// Logout
export interface ILogoutParams {
  userName: string;
  Token?: string;
}

export interface ILogoutResult {}
// Update Account
export interface IUpdateAccountParams {
  ApiKey: string;
  Token: string;
  Otp: string;
  UserName: string;
  Password: string;
  RePassword: string;
}

// Confirm OTP
export interface IConfirmOtpParams {
  Otp: string;
  UserName?: string;
}
// Forgot Password
export interface IForgotPasswordParams {
  userName: string;
}
export interface IDecoded {
  id: string;
  iat: number;
  exp: number;
}
