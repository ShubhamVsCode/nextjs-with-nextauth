import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session?.user?.name}
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </>
  );
}
