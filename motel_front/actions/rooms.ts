"use server";
import { api } from "@/lib/api";
import {
  RoomBase,
  RoomResponse,
  RoomType,
  RoomTypeList,
} from "@/types/rooms.type";

export async function getRooms(): Promise<RoomTypeList> {
  try {
    const res = await api.get<RoomResponse>("/rooms");

    return res.data;
  } catch {
    return [];
  }
}

export async function getRoomByName(name: string): Promise<RoomType | null> {
  try {
    const res = await api.get<String>(`/rooms/name/${name}`);

    return res.data;
  } catch {
    return null;
  }
}

export async function createRoom(data: RoomBase): Promise<void> {
  await api.post("/rooms", data);
}
