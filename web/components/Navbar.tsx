import React from "react";
import { useAuth } from "../contexts/auth";
import Link from "next/link";

export default function SiteNavbar() {
  const { user, logout, isLoading } = useAuth();
  return (
    <div className="flex justify-between p-2">
      <div/>
      {/*<Link href="/">
        <a>Home</a>
  </Link>*/}

      <div className="text-right">
        {user ?
       
        <button className="hover:text-blue-600" onClick={() => logout({ redirectLocation: "/login" })}>Logout</button> :  <Link href="/login">
        <a className="hover:text-blue-600" >Login</a>
      </Link>}
      </div>
    </div>
  );
}
