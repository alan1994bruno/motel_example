"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function clearCookie() {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", {
    path: "/",
    expires: new Date(0), // Expira imediatamente
  });
  cookieStore.set("access", "", {
    path: "/",
    expires: new Date(0), // Expira imediatamente
  });
}
