import { useRef, useState } from "react";
import ApiCall from "../apiCalls";
import { useOutletContext, useNavigate } from "react-router";
import text from "../styles/text.module.css";
import auth from "../styles/auth.module.css";
import icons from "../styles/icons.module.css";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router";
import Validate from "../components/Validate";

const SignUp = () => {
  const [passwordConfirm, setPasswordConfirm] = useState(null);

  const password = useRef(null);

  const email = useRef(null);

  const passMatch = useRef(null);

  const [login] = useOutletContext();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passMatch: "",
  });

  const nav = useNavigate();

  const validateForm = () => {
    if (!validateEmail()) return false;

    if (!validatePassword()) return false;

    if (!passwordConfirm) {
      setErrors(...errors, { passwordMatch: "Passwords do not Match!" });
      return false;
    }
    setErrors({
      email: "",
      password: "",
      passMatch: "",
    });

    return true;
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

  const changeEmail = (e) => {
    email.current = e.target.value;
  };

  const changePassword = (e) => {
    password.current = e.target.value;
  };

  const validatePassMatch = (e) => {
    passMatch.current = e.target.value;

    setPasswordConfirm(e.target.value);

    if (passwordConfirm && passwordConfirm == password) {
      setErrors({ ...errors, passMatch: "" });
    } else {
      setErrors({ ...errors, passMatch: "Passwords do not match!" });
    }
  };

  const attemptSignIn = async (formData) => {
    if (!validateForm()) return;

    const confirm = await ApiCall.signUp(formData);

    if (confirm.data.errors) {
      confirm.data.errors.forEach((err) => {
        switch (err.path) {
          case "email":
            setErrors({ ...errors, email: err.msg });
            break;

          case "password":
            setErrors({ ...errors, password: err.msg });
            break;

          case "passwordConfirm":
            setErrors({ ...errors, passMatch: err.msg });
            console.log(errors);
            break;
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
      console.log(`Error signing up: ${e}`);
    }
  };

  return (
    <div className={auth.background}>
      <div className={auth.authCard}>
        <Link className={icons.authCloseIcon} to="/">
          <IoCloseOutline />
        </Link>

        <h1 className={text.headingTitle}>Sign in</h1>
        <p className={text.italicText}>to join the conversation</p>

        <form action={attemptSignIn} className={auth.form}>
          <div className={auth.inputContainer}>
            {errors.email && <div className={auth.error}>{errors.email}</div>}
            <input
              className={auth.input}
              type="text"
              name="email"
              id="email"
              required
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
              id=""
              required
              onBlur={validatePassword}
              onChange={changePassword}
              placeholder="Password"
            />
          </div>

          <div className={auth.inputContainer}>
            {passwordConfirm && errors.passMatch && (
              <div className={auth.error}>{errors.passMatch}</div>
            )}
            <input
              className={auth.input}
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              required
              onChange={validatePassMatch}
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

export default SignUp;
