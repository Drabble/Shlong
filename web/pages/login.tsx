import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useAuth } from "../contexts/auth";
import { useEffect } from "react";

function Login() {
  let windowObjectReference = null;
  let previousUrl = null;

  const { user, loadUserFromCookies } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  });

  const receiveMessage = (event) => {
    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    if (event.origin !== "http://localhost:3000") {
      return;
    }
    const { data } = event;
    // if we trust the sender and the source is our popup
    if (data.source === "login-redirect") {
      console.log("Login successful...");
      // get the URL params and redirect to our server to use Passport to auth/login
      const { payload } = data;
      //const redirectUrl = `/auth/google/login${payload}`;
      //window.location.pathname = redirectUrl;

      axios.get(`http://localhost:5000/auth/google/callback${payload}`).then(async (response) => {
        console.log(response);
        Cookies.set("token", response.data.token, { expires: 60 });
        await loadUserFromCookies();
        router.push("/");
      });
    }
  };

  const openSignInWindow = (url, name) => {
    console.log("Open login window...");
    if (typeof window !== "undefined") {
      // remove any existing event listeners
      window.removeEventListener("message", receiveMessage);

      // window features
      const strWindowFeatures = "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

      if (windowObjectReference === null || windowObjectReference.closed) {
        /* if the pointer to the window object in memory does not exist
        or if such pointer exists but the window was closed */
        windowObjectReference = window.open(url, name, strWindowFeatures);
      } else if (previousUrl !== url) {
        /* if the resource to load is different,
        then we load it in the already opened secondary window and then
        we bring such window back on top/in front of its parent window. */
        windowObjectReference = window.open(url, name, strWindowFeatures);
        windowObjectReference.focus();
      } else {
        /* else the window reference must exist and the window
        is not closed; therefore, we can bring it back on top of any other
        window with the focus() method. There would be no need to re-create
        the window or to reload the referenced resource. */
        windowObjectReference.focus();
      }

      // add the listener for receiving a message from the popup
      window.addEventListener("message", (event) => receiveMessage(event), false);
      // assign the previous URL
      previousUrl = url;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Shlong</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Please <span className="text-blue-600">Shlogin</span>
        </h1>

        <p className="mt-3 text-2xl">
          <button onClick={() => openSignInWindow("http://localhost:5000/auth/google", "test")} className="bg-gray-50 rounded-lg p-8 hover:border">
            <FcGoogle className="h-12 w-12" />
          </button>
        </p>
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
  );
}
const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
