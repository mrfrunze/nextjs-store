import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(['/', '/products(.*)', '/about']);

export default clerkMiddleware((auth, req) => {
  try {
    if (!isPublicRoute(req)) {
      auth().protect();  // Защита маршрутов, требующих авторизации
    }
  } catch (error) {
    // Обработка ошибок токенов
    if (error.message.includes('token-not-active-yet')) {
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