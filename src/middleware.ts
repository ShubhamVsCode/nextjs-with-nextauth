import { Role } from "@prisma/client";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define page types and their required role
const publicPaths = ["/public"]
const pageConfig = [
    { path: "/admin", role: Role.ADMIN }, // This will manage all the paths starting with /admin/:path*
    { path: "/superadmin", role: Role.SUPERADMIN },
    // Add more page types as needed
];

// ORDER IS VERY IMPORTANT!!! // USER can't access ADMIN or SUPERADMIN but ADMIN can access USER
const roleHierarchy: Role[] = ["USER", "ADMIN", "SUPERADMIN"];

function checkRole(request: NextRequestWithAuth, requiredRole: Role) {
    const userRole = request.nextauth.token?.role as Role;

    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

    return userRoleIndex !== -1 && userRoleIndex >= requiredRoleIndex;
}

function redirectToDeniedPage(request: NextRequestWithAuth) {
    return NextResponse.rewrite(new URL("/denied", request.url));
}

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        const { pathname } = request.nextUrl;

        for (const { path, role } of pageConfig) {
            if (pathname.startsWith(path) && !checkRole(request, role)) {
                return redirectToDeniedPage(request);
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Checking If it is a public path or the root path "/"
                // If you don't want "/" page to be public remove the req.nextUrl.pathname === "/" from the condition below
                if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path)) || req.nextUrl.pathname === "/") {
                    return true
                }
                return !!token
            },
        },
    }
);

export const config = {
    matcher: pageConfig.map(({ path }) => `${path}/:path*`).push(...publicPaths.map((path) => `${path}/:path*`)),
};
