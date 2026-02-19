// for GET / response
export interface GroupResponse {
  id: string;
  name: string;
  swish_number: string | null;
  invite_code: string;
}

export interface SwishSetResponse {
  swish_number: string;
}


export interface UserResponse {
  id: string;
  group_id: string;
  beers: number;
  name: string;
  phone_number: string;
  admin: boolean;
  owner: boolean;
  group: GroupResponse;
  
}

export interface UserBeersResponse {
  id: string;
  beers: number;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
  token_type: string;
}
export interface BeerLogResponse {
  id: string;
  timestamp: string;
  user_id: string;
}

export interface AdminStatsResponse {
  id: string;
  name: string;
  admin: boolean;
  total_beers: number;
  beer_log: BeerLogResponse[];
  
}

// for POST / create

export interface SwishSetRequest {
  swish_number: string;
}

export interface GroupCreate {
  name: string;
  group_name: string;
  phone_number: string;
  pin: string;

}

export interface UserCreate {
  name: string;
  invite_code: string;
  phone_number: string;
  pin: string;
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
