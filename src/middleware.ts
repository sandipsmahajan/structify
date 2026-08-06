export { auth as middleware } from "@/lib/auth-edge";

export const config = {
  matcher: [
    "/practice/:path*",
    "/visualize/:path*",
    "/learn/non-linear-structures/:path*",
    "/learn/algorithms-patterns/:path*",
    "/learn/interview-mastery/:path*",
  ],
};
