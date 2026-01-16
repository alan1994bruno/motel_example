import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// { protectRoot } from "./lib/protect";

// Rotas públicas que não exigem autenticação
const publicRoutes = [
  "/login",
  "/",
  "/forgot-password/step1",
  "/forgot-password/step2",
];

const rootRoutes = ["/users"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isRootRoutes = rootRoutes.some((route) => pathname.startsWith(route));

  // Se estiver em rota pública
  if (isPublic) {
    // Se já tiver token, redireciona para home
    if (token) {
      //return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next(); // Permite acesso à rota pública
  }

  // Se estiver em rota privada e não tiver token, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /* if (isRootRoutes && !(await protectRoot())) {
    return NextResponse.redirect(new URL("/", request.url));
  }*/
  // Se estiver em rota privada e tiver token, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico|images|api).*)"],
};
