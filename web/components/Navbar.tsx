import React from "react";
import { useAuth } from "../contexts/auth";
import Link from "next/link";

export default function SiteNavbar() {
  const { user, logout, isLoading } = useAuth();
  return (
    <div className="sticky flex justify-between">
      <Link href="/">
        <a>Home</a>
      </Link>

      <div className="text-right">
        (user ?
        <Link href="/login">
          <a>Login</a>
        </Link>{" "}
        :<button onClick={() => logout({ redirectLocation: "/login" })}>Logout</button>)
      </div>
    </div>
  );
}
