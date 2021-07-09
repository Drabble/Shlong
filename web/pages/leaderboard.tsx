import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../contexts/auth";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function Home() {
  const [users, setUsers] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      try {
        await api.get("/users").then((response) => {
          setUsers(response.data);
        });
      } catch {
        logout();
      }
    }
    loadUsers();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-2 flex-grow mb-8">
        <Head>
          <title>Shlong leaderboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-2 text-center">
          <Link href="/">
            <a className="mt-8 text-lg text-blue-600 hover:font-bold">
              Go back
            </a>
          </Link>

          <h1 className="text-6xl font-bold">Leaderboard</h1>

          <div className="md:max-w-2xl max-w-full mt-6 sm:w-full  bg-gray-100 p-4">
            <div className="w-full max-w-full overflow-x-auto">
              <table className="min-w-full w-auto">
                <thead>
                  <tr>
                    <th></th>
                    <th>Username</th>
                    <th>Join date</th>
                    <th>BTC</th>
                    <th>$</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={i}>
                      <td>
                        <img
                          className="min-h-12 h-12 min-w-12 w-12"
                          src={user.image}
                        />
                      </td>
                      <td>{user.displayName}</td>
                      <td>{user.createdAt}</td>
                      <td>3</td>
                      <td>{user.dollars}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
