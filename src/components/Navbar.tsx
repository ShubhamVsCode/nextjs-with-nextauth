"use client";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const session = useSession();

  return (
    <nav className="flex justify-between px-20 py-5">
      <Link href={"/"}>Home</Link>
      <Link href={"/public"}>Public</Link>
      <Link href={"/dashboard"}>Dashboard</Link>
      <Link href={"/admin"}>Admin</Link>
      <Link href={"/admin/dashboard"}>Admin Dashboard</Link>
      <Link href={"/superadmin"}>SuperAdmin</Link>
      {session.status === "authenticated" ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button
          onClick={() =>
            signIn("google", {
              callbackUrl: "http://localhost:3000/",
              redirect: true,
            })
          }
        >
          Sign in
        </button>
      )}
    </nav>
  );
};

export default Navbar;
