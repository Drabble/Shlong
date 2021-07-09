import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../contexts/auth";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

export default function Home() {
  const { user, loadUserFromCookies, logout } = useAuth();

  const updateState = async (state) => {
    try {
      await api.post(`/state/${state}`);
    } catch {
      logout();
    }
    loadUserFromCookies();
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center flex-grow mb-8 p-2">
        <Head>
          <title>Shlong</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
          <h1 className="text-6xl font-bold">
            Welcome to <span className="text-blue-600">Shlong</span>
          </h1>

          <p className="mt-3 text-2xl ">
            Decide wether to shlong, shlort or shledium based on the
            <a
              className="p-2 font-mono text-lg bg-gray-100 rounded-md hover:text-blue-600 cursor-pointer ml-1"
              href="https://www.tradingview.com/chart/SrTXfsxj/"
              target="_blank"
            >
              Bitcoin price
            </a>
          </p>

          <p className="mt-3 text-2xl">
            You currently own{" "}
            <code className="p-2 font-mono text-lg bg-gray-100 rounded-md hover:text-blue-600">
              3.5 BTC
            </code>{" "}
            which equal{" "}
            <code className="p-2 font-mono text-lg bg-gray-100 rounded-md hover:text-blue-600">
              100'000 $
            </code>
          </p>

          <div className="flex flex-wrap gap-2 items-center justify-center max-w-full mt-6 md:max-w-8xl">
            <div
              className={`flex justify-center items-center p-6 border w-96 max-w-full rounded-xl hover:text-blue-600 cursor-pointer ${
                user.state === "shlort"
                  ? "bg-blue-600 text-white hover:text-white"
                  : ""
              }`}
              onClick={() => updateState("shlort")}
            >
              <h3 className="text-2xl font-bold">Shlort</h3>
            </div>
            <div
              className={`flex justify-center items-center p-6 border w-96 max-w-full rounded-xl hover:text-blue-600 cursor-pointer ${
                user.state === "shledium"
                  ? "bg-blue-600 text-white hover:text-white"
                  : ""
              }`}
              onClick={() => updateState("shledium")}
            >
              <h3 className="text-2xl font-bold">Shledium</h3>
            </div>
            <div
              className={`flex justify-center items-center p-6 border w-96 max-w-full rounded-xl hover:text-blue-600 cursor-pointer ${
                user.state === "shlong"
                  ? "bg-blue-600 text-white hover:text-white"
                  : ""
              }`}
              onClick={() => updateState("shlong")}
            >
              <h3 className="text-2xl font-bold">Shlong</h3>
            </div>
          </div>

          <Link href="/leaderboard">
            <a className="mt-8 text-lg text-blue-600 hover:font-bold">
              You can checkout the leaderboard here
            </a>
          </Link>
        </main>
      </div>
    </MainLayout>
  );
}
