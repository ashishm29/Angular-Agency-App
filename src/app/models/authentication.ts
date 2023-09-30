export class Authentication {
  idToken!: string;
  email!: string;
  refreshToken!: string;
  expiresIn!: string;
  localId!: string;
  registered!: boolean;
}

export class UserDetails {
  email!: string;
  localId!: string;
  returnSecureToken!: boolean;
}

export class User {
  id!: string;
  mobileNumber!: number;
  password!: string;
  Roles!: Role[];
}

export class Role {
  RoleId!: number;
  RoleName!: string;
}
