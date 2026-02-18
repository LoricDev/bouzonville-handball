export { auth as middleware } from "@/lib/auth";

export const config = {
  // Protège toutes les routes sauf les assets statiques et les API publiques
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
