import Home from "@/pages/Home";
import Admin from "@/pages/Admin";

export default function App() {
  return window.location.pathname === "/admin" ? <Admin /> : <Home />;
}
