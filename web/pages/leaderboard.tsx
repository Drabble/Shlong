import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Shlong leaderboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          
        <Link href="/">
          <a className="mt-8 text-lg text-blue-600 hover:font-bold">Go back</a>
        </Link>

        <h1 className="text-6xl font-bold">
          <span className="text-blue-600">
            Shl
          </span>
          eaderboard
        </h1>


        <div  className="max-w-2xl mt-6 sm:w-full bg-gray-200 py-4">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-black">
                        <th>Username</th>
                        <th>BTC</th>
                        <th>$</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Tony
                        </td>
                        <td>
                            3
                        </td>
                        <td>
                            100'000
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
       
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t mt-4">
        <p
          className="flex items-center justify-center"
        >
          Powered by <a className="text-blue-600 hover:font-bold ml-1" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Tony</a>
        </p>
      </footer>
    </div>
  )
}
