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
  username!: string;
  role!: string;
  mobileNumber!: number;
  password!: string;
  salary!: number;
}

export class Role {
  RoleId!: number;
  RoleName!: string;
}
