export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  gender: string;
}

export interface Parcel {
  id: string;
  biker_id?: number | null;
  created_time?: null | Date;
  deliver_time?: null | Date
  from_address: string;
  pick_up_time?: null | Date;
  sender_id: number;
  status: ParcelStatus;
  to_address: string;
}

export enum ParcelStatus {
  Delivered = 'delivered',
  New = 'new',
  Transit = 'transit'
}

export interface JWTDecode {
  id: number;
  email: string;
  exp: number;
  iat: number;
  role: string;
}

export enum UserRoles {
  Biker = 'biker',
  Sender = 'sender'
}

export interface NewParcel {
  fromAddress: string;
  toAddress: string;
}