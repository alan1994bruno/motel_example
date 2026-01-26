import { RoomType } from "@/@types/rooms";
import { api } from "./api";
import { PaginatedResponse } from "@/@types/page";

export async function getRooms(): Promise<RoomType[]> {
  const res = await api.get("/rooms");
  return res.data;
}

export async function getRoomsPage(
  page: number,
): Promise<PaginatedResponse<RoomType>> {
  const res = await api.get(`/rooms/page?page=${page}`);
  return res.data;
}

export async function getRoomByPublicId(publicId: string): Promise<RoomType> {
  const res = await api.get(`/rooms/${publicId}`);

  return res.data;
}
