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

// for PUT / update
export interface UserUpdateAdmin {
  id: string;
  beers: number;
}

// for PUT / decrement beer
export interface UserDecrementBeer {
  id: string;
}

// for GET / by id
export interface GetUserById {
  id: string;
}

export interface CheckIfUserExists {
  phone_number: string;
}

export interface UserLogin {
  phone_number: string;
  pin: string;
}
