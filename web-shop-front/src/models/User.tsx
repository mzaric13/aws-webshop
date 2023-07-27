export interface SignUpReturnValue {
  statusCode: number;
  message: string;
}

export default interface User {
  username: string;
  password: string;
  givenName: string;
  familyName: string;
  birthdate: string;
  phoneNumber: string;
  address: string;
}
