import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import { RouterProvider } from "react-router";
import "./styles/reset.css";
import SelectionContext from "./selectionContext";
import router from "./routes.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);

  const [email, setEmail] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      login(email);
    }
  }, []);

  const login = (email) => {
    setIsLoggedIn(true);
    setEmail(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    setEmail(null);
  };

  return (
    <AuthContext value={{ isLoggedIn, email, login, logout }}>
      <SelectionContext value={{ selectedPost, setSelectedPost }}>
        <RouterProvider router={router} />
      </SelectionContext>
    </AuthContext>
  );
}

export default App;
