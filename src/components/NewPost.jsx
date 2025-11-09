import editPosts from "../styles/editPosts.module.css";
import { IoCloseOutline } from "react-icons/io5";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import home from "../styles/home.module.css";
import text from "../styles/text.module.css";
import icons from "../styles/icons.module.css";
import { useContext, useState } from "react";
import ApiCall from "../apiCalls";
import AuthContext from "../AuthContext";
import { Link, useNavigate } from "react-router";
import { FaCheck } from "react-icons/fa6";
import { toast, Bounce, ToastContainer } from "react-toastify";
import SelectionContext from "../selectionContext";

const md = MarkdownIt({
  linkify: false,
  typographer: false,
});

md.use(
  await Shiki({
    theme: "kanagawa-dragon",
  }),
);

export const NewPost = () => {
  const nav = useNavigate();

  const { email, isLoggedIn, logout } = useContext(AuthContext);

  const { selectedPost } = useContext(SelectionContext);

  const [post, setMarkdownSource] = useState(
    selectedPost ? selectedPost.text : "",
  );

  const [title, setTitle] = useState(selectedPost ? selectedPost.title : "");

  const successNotify = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const errorNotify = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const dynamicUpdate = (e) => {
    try {
      md.render(e.target.value);
      setMarkdownSource(e.target.value);
    } catch (e) {
      console.log(e);
    }
  };

  const dynamicTitle = (e) => {
    try {
      setTitle(e.target.value);
    } catch (e) {
      console.log(e);
    }
  };

  const newPost = async () => {
    const result = await ApiCall.newPost({
      text: post,
      title: title,
      email: email,
    });

    if (result.status == 200) {
      successNotify("Successfully added new post!");
      console.log(result);
    } else {
      errorNotify("Failed to add new post!");
      console.log(result);
    }
  };

  const editPost = async () => {
    const result = await ApiCall.editPost({
      text: post,
      postId: selectedPost.id,
      title: title,
      email: email,
    });

    if (result.status == 200) {
      successNotify("Successfully edited post!");
      console.log(result);
    } else {
      errorNotify("Failed to edit post!");
      console.log(result);
    }
  };

  return (
    <div className={editPosts.body}>
      <div className={home.navigation}>
        <h1 className={text.headingTitle}>Blog Writer</h1>
        <div className={editPosts.links}>
          <span className={icons.closeIcon} onClick={() => nav("/")}>
            <IoCloseOutline />
          </span>
          <button
            className={home.button}
            style={{
              display: "flex",
            }}
            onClick={() => (selectedPost ? editPost() : newPost())}
          >
            <FaCheck className={icons.edit} />
          </button>
          {isLoggedIn ? (
            <Link to="/" onClick={() => logout()}>
              Logout
            </Link>
          ) : (
            <Link to="/auth/log-in">LogIn</Link>
          )}
        </div>
      </div>
      <div className={editPosts.container}>
        <div className={editPosts.post}>
          <h1>{title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: md.render(post),
            }}
          />
        </div>
        <div className={editPosts.inputContainer}>
          <input
            type="text"
            name="title"
            id=""
            placeholder="Title"
            className={editPosts.titleInput}
            value={title}
            onChange={dynamicTitle}
          />
          <textarea
            name="post"
            id=""
            onChange={dynamicUpdate}
            value={post}
            className={editPosts.input}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
