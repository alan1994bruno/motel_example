export interface RoomImageBase {
  url: string;
}

export interface RoomImage extends RoomImageBase {
  publicId: string; // uuid
}

export interface RoomBase {
  name: string;
  hourlyRate: number;
  units: number;
  images: string[];
}

export interface RoomType {
  publicId: string; // uuid
  name: string;
  hourlyRate: number;
  units: number;
  images: RoomImage[];
}

export type RoomTypeList = RoomType[];

export type RoomResponse = {
  data: RoomTypeList;
};
