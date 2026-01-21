"use server";
import { api } from "@/lib/api";
import { RoomBase, RoomType, RoomTypeList } from "@/types/rooms.type";

export async function getRooms(): Promise<RoomTypeList> {
  const res = await api.get("/rooms");
  return res.data;
}

export async function getRoomByPublicId(publicId: string): Promise<RoomType> {
  const res = await api.get(`/rooms/${publicId}`);

  return res.data;
}

export async function createRoom(data: RoomBase): Promise<void> {
  await api.post("/rooms", data);
}
