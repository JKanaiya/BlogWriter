import { useEffect, useState } from "react";
import Home from "./components/Home";
import AuthContext from "./AuthContext";
import { BrowserRouter, Route, Routes } from "react-router";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Auths from "./components/Auth";
import "./styles/reset.css";
import { NewPost } from "./components/NewPost";
import SelectionContext from "./selectionContext";

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="new-post" element={<NewPost />} />
            <Route path="auth" element={<Auths />}>
              <Route path="sign-up" element={<SignUp />} />
              <Route path="log-in" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SelectionContext>
    </AuthContext>
  );
}

export default App;
