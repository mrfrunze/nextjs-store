import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/', '/products(.*)', '/about']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware((auth, req) => {
  const isAdminUser = auth().userId === process.env.ADMIN_USER_ID;

  try {
    // console.log(auth().userId);

    if (isAdminRoute(req) && !isAdminUser) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    if (!isPublicRoute(req)) {
      auth().protect();  // Защита маршрутов, требующих авторизации
    }
  } catch (error) {
    const err = error as Error; // Приведение к типу Error
    // Обработка ошибок токенов
    if (err.message.includes('token-not-active-yet')) {
      console.error("JWT token is not yet valid. Possible clock skew issue.");
      // Дополнительная логика, если необходимо (например, повторная проверка через некоторое время)
      // Варианты: ждать или перенаправить пользователя на страницу с уведомлением
    } else {
      console.error("An unexpected error occurred during authentication", error);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};