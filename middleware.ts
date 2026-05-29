import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    '/',
    '/login(.*)',
    '/onboarding(.*)',
])

//any route not in the isPublicRoute list requires a logged-in user. Right now that means /dashboard is protected and everything else is public

export default clerkMiddleware(async(auth, request) => {
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

//this matcher excludes static files like fonts and images which don't need auth checks