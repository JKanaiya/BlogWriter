import { useNavigate } from "react-router";
import error from "../styles/error.module.css";

const ErrorPage = () => {
  const nav = useNavigate();

  return (
    <div className={error.container}>
      <h1 className={error.heading}>404</h1>
      <button className={error.button} onClick={() => nav("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
