export interface SignUpReturnValue {
  statusCode: number;
  message: string;
}

export interface UserCreation {
  username: string;
  password: string;
  givenName: string;
  familyName: string;
  birthdate: string;
  phoneNumber: string;
  address: string;
}

export interface User {
  id: number;
  email: string;
  givenName: string;
  familyName: string;
  address: string;
  phoneNumber: string;
  birthdate: Date;
}
