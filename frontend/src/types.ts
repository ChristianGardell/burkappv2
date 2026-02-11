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
  total_beers: number;
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
export interface UserCheck {
  phone_number: string;
}

// for PUT / update
export interface UserUpdateAdmin {
  id: string;
  beers: number;
}
export interface AdminStats {
  id: string;
  name: string;
  admin: boolean;
  total_beers: number;
}
