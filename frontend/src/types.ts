// --- Authentication & User Input ---

export interface UserLoginRequest {
  phone_number: string;
  pin: string;
}

export interface UserCreateRequest {
  name: string;
  invite_code: string;
  phone_number: string;
  pin: string;
}

export interface GroupCreateRequest {
  name: string;
  group_name: string;
  phone_number: string;
  pin: string;
}

// --- Admin Input ---

export interface UserUpdateAdmin {
  id: string;
  beers: number;
}

// --- Owner Input ---
export interface GroupNameChangeRequest {
  name: string;
}

export interface SwishSetRequest {
  swish_number: string;
}

export interface PricePerBeerSetRequest {
  price_per_beer: number;
}

export interface AdminChangeRequest {
  phone_number: string;
}

// --- Responses ---

export interface GroupResponse {
  id: string;
  name: string;
  swish_number: string | null;
  price_per_beer: number;
  invite_code: string;
}

export interface SwishSetResponse {
  swish_number: string;
}

export interface PricePerBeerSetResponse {
  price_per_beer: number;
}

export interface UserResponse {
  id: string;
  group: GroupResponse;
  beers: number;
  name: string;
  phone_number: string;
  admin: boolean;
  owner: boolean;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
  token_type: string;
}

export interface UserBeerResponse {
  id: string;
  beers: number;
}

export interface BeerLogResponse {
  id: string;
  timestamp: string;
  user_id: string;
}

export interface AdminStatsResponse {
  id: string;
  name: string;
  phone_number: string;
  admin: boolean;
  total_beers: number;
  beer_log: BeerLogResponse[];
}
