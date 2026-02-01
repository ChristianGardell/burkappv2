// for POST / create
export interface UserCreate {
  name: string;
  phone_number: string;
  pin: string;
}

// for GET / response
export interface UserResponse {
  id: string;
  beers: number;
  name: string;
  phone_number: string;
  pin: string;
  admin: boolean;
  accessed_token?: string;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
  token_type: string;
}

export interface UserLogin {
  phone_number: string;
  pin: string;
}

export interface UserUpdate {
  id: string;
  phone_number: string;
  pin: string;
}
// for PUT / update
export interface UserUpdateAdmin {
  id: string;
  beers: number;
}
