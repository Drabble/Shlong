import "tailwindcss/tailwind.css";
import { wrapper } from "../redux/store";
import { AuthProvider, ProtectRoute } from "../contexts/auth";
import "../assets/styles.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ProtectRoute>
        <Component {...pageProps} />
      </ProtectRoute>
    </AuthProvider>
  );
}

export default wrapper.withRedux(MyApp);
