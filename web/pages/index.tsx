import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../contexts/auth";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useEffect, useState } from "react";
const client = new W3CWebSocket(process.env.NEXT_PUBLIC_SHLONG_WEBSOCKET_URL);

export default function Home() {
  const { user, loadUserFromCookies, logout } = useAuth();
  const [btcUsd, setBtcUsd] = useState(1.0);

  useEffect(() => {
    console.log("Init");
    setBtcUsd(parseFloat(user.btc_price));
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      console.log(message);
      setBtcUsd(parseFloat(JSON.parse(message.data).btc_usd));
    };
  }, []);

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
            <span className="text-blue-600">Shlong</span>
          </h1>
          <p className="mt-3 text-lg">
            Bitcoin price
            <a className="hover:text-blue-600 cursor-pointer" href="https://www.binance.com/en/trade/BTC_USDT?theme=dark&type=spot" target="_blank">
              <span className="font-mono bg-gray-100 rounded-md ml-1 p-2">{btcUsd.toFixed(2)}$</span>
            </a>
          </p>
          <p className="mt-3 text-lg">
            You have{" "}
            <code className="p-2 font-mono text-lg bg-gray-100 rounded-md hover:text-blue-600">
              {user.dollars.toFixed(2)}${" "}
              {user.state === "shlong" ? (
                (user.btc * btcUsd - user.dollars) * 10 > 0 ? (
                  <span className="text-green-600">+ {((user.btc * btcUsd - user.dollars) * 10).toFixed(2)}</span>
                ) : (
                  <span className="text-red-600">- {(-(user.btc * btcUsd - user.dollars) * 10).toFixed(2)}$</span>
                )
              ) : user.state === "shlort" ? (
                -(user.btc * btcUsd - user.dollars) * 10 > 0 ? (
                  <span className="text-green-600">+ {(-(user.btc * btcUsd - user.dollars) * 10).toFixed(2)}</span>
                ) : (
                  <span className="text-red-600">- {((user.btc * btcUsd - user.dollars) * 10).toFixed(2)}$</span>
                )
              ) : (
                ""
              )}
            </code>
          </p>

          <div className="flex flex-wrap gap-2 items-center justify-center max-w-full mt-6 md:max-w-8xl">
            <div
              className={`flex justify-center items-center p-6 border w-96 max-w-full rounded-xl hover:text-blue-600 cursor-pointer ${user.state === "shlort" ? "bg-blue-600 text-white hover:text-white" : ""}`}
              onClick={() => updateState("shlort")}
            >
              <h3 className="text-2xl font-bold">Shlort</h3>
            </div>
            <div
              className={`flex justify-center items-center p-6 border w-96 max-w-full rounded-xl hover:text-blue-600 cursor-pointer ${user.state === "shledium" ? "bg-blue-600 text-white hover:text-white" : ""}`}
              onClick={() => updateState("shledium")}
            >
              <h3 className="text-2xl font-bold">Shledium</h3>
            </div>
            <div
              className={`flex justify-center items-center p-6 border w-96 max-w-full rounded-xl hover:text-blue-600 cursor-pointer ${user.state === "shlong" ? "bg-blue-600 text-white hover:text-white" : ""}`}
              onClick={() => updateState("shlong")}
            >
              <h3 className="text-2xl font-bold">Shlong</h3>
            </div>
          </div>
          <Link href="/leaderboard">
            <a className="mt-4 text-lg text-blue-600 hover:font-bold">Leaderboard</a>
          </Link>
        </main>
      </div>
    </MainLayout>
  );
}
