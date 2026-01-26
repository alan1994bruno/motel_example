import { RoomType } from "./rooms";

export type ReservationRequest = {
  roomPublicId: string; // uuid
  checkinTime: string; // ISO 8601 datetime
  checkoutTime: string; // ISO 8601 datetime
};

export type ReservationSummary = {
  publicId: string; // uuid
  checkinTime: string; // ISO 8601 datetime
  checkoutTime: string; // ISO 8601 datetime
  occupied: boolean;
  penaltyApplied: boolean;
  price: number;
  room: RoomType;
};
