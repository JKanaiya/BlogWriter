import ApiCall from "../apiCalls";
import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import text from "../styles/text.module.css";
import auth from "../styles/auth.module.css";
import icons from "../styles/icons.module.css";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router";
import Validate from "../components/Validate";

const Login = () => {
  const nav = useNavigate();
  const [login] = useOutletContext();
  const password = useRef(null);
  const email = useRef(null);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passMatch: "",
    invalidCredentials: "",
  });

  const changeEmail = (e) => {
    email.current = e.target.value;
  };

  const changePassword = (e) => {
    password.current = e.target.value;
  };

  const validateEmail = () => {
    if (Validate.email(email.current)) {
      setErrors({ ...errors, email: "" });
      return true;
    } else {
      setErrors({ ...errors, email: "Invalid Email" });
      return false;
    }
  };

  const validatePassword = () => {
    if (Validate.password(password.current)) {
      setErrors({ ...errors, password: "" });
      return true;
    } else {
      setErrors({ ...errors, password: "Password must be at min 8 chars" });
      return false;
    }
  };

  const validateForm = () => {
    if (!validateEmail()) return false;

    if (!validatePassword()) return false;

    setErrors({ email: "", password: "" });

    return true;
  };

  const attemptLogin = async (formData) => {
    if (!validateForm()) return;

    const confirm = await ApiCall.logIn(formData);

    console.log(confirm);

    if (confirm.data.errors) {
      confirm.data.errors.forEach((err) => {
        switch (err.path) {
          case "email":
            setErrors({ ...errors, email: err.msg });
            break;
          case "password":
            setErrors({ ...errors, password: err.msg });
            break;
          default:
            setErrors({ ...errors, invalidCredentials: err.msg });
        }
      });
    }

    try {
      const response = await ApiCall.logIn(formData);

      if (!response.status == 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", formData.get("email"));

      login(formData.get("email"));
      nav("/");
    } catch (e) {
      console.log(`Error logging in: ${e}`);
    }
  };

  return (
    <div className={auth.background}>
      <div className={auth.authCard}>
        <Link className={icons.authCloseIcon} to="/">
          <IoCloseOutline />
        </Link>
        <h1 className={text.headingTitle}>LOGIN</h1>
        <p className={text.italicText}>to continue your conversation</p>
        <form className={auth.form} action={attemptLogin}>
          <div className={auth.inputContainer}>
            {errors.invalidCredentials && (
              <div className={auth.error}>{errors.invalidCredentials}</div>
            )}
            {errors.email && <div className={auth.error}>{errors.email}</div>}
            <input
              className={auth.input}
              type="text"
              name="email"
              id="email"
              onBlur={validateEmail}
              onChange={changeEmail}
              placeholder="Email"
            />
          </div>
          <div className={auth.inputContainer}>
            {errors.password && (
              <div className={auth.error}>{errors.password}</div>
            )}
            <input
              className={auth.input}
              type="password"
              name="password"
              id="password"
              onBlur={validatePassword}
              onChange={changePassword}
              placeholder="Password"
            />
          </div>
          <button className={auth.button} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
