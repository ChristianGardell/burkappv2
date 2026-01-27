

// For POST / create
export interface UserCreate {
  name: string;
  phone_number: string;
  admin?: boolean; // optional, default false
}

// For GET / response
export interface UserResponse {
  id: number;
  beers: number;
  name: string;
  phone_number: string;
  admin: boolean;
}

// For PUT / update
export interface UserUpdate {
  id: number;
  beers?: number | null; // optional, can be null
  admin?: boolean;       // optional
}
