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