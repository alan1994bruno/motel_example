"use server";
import { api } from "@/lib/api";
import { PageResponse } from "@/types/page.type";
import { RoomBase, RoomType } from "@/types/rooms.type";

export async function getRooms(): Promise<RoomType[]> {
  const res = await api.get("/rooms");
  return res.data;
}

export async function getRoomsPage(
  page: number,
): Promise<PageResponse<RoomType>> {
  const res = await api.get(`/rooms/page?page=${page}`);
  return res.data;
}

export async function getRoomByPublicId(publicId: string): Promise<RoomType> {
  const res = await api.get(`/rooms/${publicId}`);

  return res.data;
}

export async function createRoom(data: RoomBase): Promise<void> {
  await api.post("/rooms", data);
}
