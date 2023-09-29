export class Authentication {
  idToken!: string;
  email!: string;
  refreshToken!: string;
  expiresIn!: string;
  localId!: string;
  registered!: boolean;
}

export class UserDetails {
  email! : string;
  localId! : string;
  returnSecureToken! :boolean;
}


export class User
{
  mobileNumber! : number;
  password! : string;
}
