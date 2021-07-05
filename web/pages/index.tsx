import Head from "next/head";
import Link from "next/link";
import MainLayout from "../layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>Shlong</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
            Welcome to <span className="text-blue-600">Shlong</span>
          </h1>

          <p className="mt-3 text-2xl">
            Decide wether to shlong, shlort or shledium based on the
            <a className="p-2 font-mono text-lg bg-gray-100 rounded-md hover:text-blue-600 cursor-pointer ml-1" href="https://www.tradingview.com/chart/SrTXfsxj/" target="_blank">
              Bitcoin price
            </a>
          </p>

          <p className="mt-3 text-2xl">
            You currently own <code className="p-2 font-mono text-lg bg-gray-100 rounded-md hover:text-blue-600">3.5 BTC</code> which equal <code className="p-2 font-mono text-lg bg-gray-100 rounded-md hover:text-blue-600">100'000 $</code>
          </p>

          <div className="flex flex-wrap gap-2 items-center justify-center max-w-8xl mt-6 sm:w-full">
            <div className="flex justify-center items-center p-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 cursor-pointer">
              <h3 className="text-2xl font-bold">Shlort</h3>
            </div>
            <div className="flex justify-center items-center p-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 cursor-pointer">
              <h3 className="text-2xl font-bold">Shledium</h3>
            </div>
            <div className="flex justify-center items-center p-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 cursor-pointer">
              <h3 className="text-2xl font-bold">Shlong</h3>
            </div>
          </div>

          <Link href="/leaderboard">
            <a className="mt-8 text-lg text-blue-600 hover:font-bold">You can checkout the leaderboard here</a>
          </Link>
        </main>

        <footer className="flex items-center justify-center w-full h-24 border-t mt-4">
          <p className="flex items-center justify-center">
            Powered by{" "}
            <a className="text-blue-600 hover:font-bold ml-1" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
              Tony
            </a>
          </p>
        </footer>
      </div>
    </MainLayout>
  );
}
