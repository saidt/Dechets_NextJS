export const USER_FETCH_URL : string = "/api/protected/user"

export type User_Type = {
  id: string;
  name: string;
  email: string;
  last_connect?: Date;
  roles: string[]
};

export const Empty_User : User_Type = {
  id: '',
  name: '',
  email: '',
  last_connect: new Date(0),
  roles: []
};
export const USER_UPDATE_PSWD_ROLE : string = "dbo.USER_.UPDATE_PSWD"
export const PASSWORD_HASH_URL : string = "/protected/user/password-hash"
export const PASSWORD_HASH_FETCH_URL : string = `${USER_FETCH_URL}/password-hash`
