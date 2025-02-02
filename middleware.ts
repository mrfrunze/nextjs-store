import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/products(.*)",
  "/about",
  "/api/ping",
]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  // console.log(auth().userId);

  // Поддержка HEAD запросов
  if (req.method === "HEAD") {
    return NextResponse.json({ message: "HEAD request allowed" }, { status: 200 });
  }

  const isAdminUser = auth().userId === process.env.ADMIN_USER_ID;
  // console.log(isAdminUser);

  if (isAdminRoute(req) && !isAdminUser) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublicRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
