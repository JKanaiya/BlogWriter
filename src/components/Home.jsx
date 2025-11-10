import useSWR from "swr";
import axios from "axios";
import ApiCall from "../apiCalls";
import Comments from "./Comments";
import Posts from "./Posts";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthContext from "../AuthContext";
import home from "../styles/home.module.css";
import text from "../styles/text.module.css";
import comment from "../styles/comments.module.css";
import icons from "../styles/icons.module.css";
import { RiSearch2Line } from "react-icons/ri";
import { IoAdd } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ToastContainer, toast, Bounce } from "react-toastify";
import SelectionContext from "../selectionContext";

export default function Home() {
  const { isLoggedIn, email } = useContext(AuthContext);

  const { selectedPost, setSelectedPost } = useContext(SelectionContext);

  const [commentsVisible, setCommentsVisible] = useState(false);

  const [selectedComment, setSelectedComment] = useState(null);

  const [filter, setFilter] = useState(null);

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

  const getPosts = async (url) => {
    const posts = await axios.get(url + "posts");
    return posts.data;
  };

  const updateSelectedComment = ({ editedText }) => {
    setSelectedComment({ ...selectedComment, text: editedText });
  };

  const searchPosts = (e) => {
    setFilter(e.target.value);
  };

  const nav = useNavigate();

  const updateComments = (selectedPost, comment) => {
    const postIndex = data.findIndex((post) => post.id == selectedPost.id);

    let b = selectedPost;

    let parentIndex;

    const findComment = (ob) => {
      if (ob.subComments == undefined) return false;
      if (ob.subComments.length == 0) return false;

      let a = ob.subComments.findIndex((c) => c.id == selectedComment.id);

      if (a >= 0) {
        if (!ob.subComments[a].subComments) {
          ob.subComments[a].subComments = [];
        }
        if (ob.subComments[a].subComments[0] === "") {
          ob.subComments[a].subComments[0] = comment;
          return ob;
        }
        ob.subComments[a].subComments.push(comment);
        return ob;
      }

      ob.subComments.forEach((c) => {
        let n = findComment(c);
        if (n != false) {
          c = n;
          return ob;
        }
      });
    };

    if (selectedComment) {
      parentIndex = selectedPost.Comment.findIndex(
        (c) => c.id == selectedComment.id,
      );

      if (parentIndex < 0) {
        b.Comment.forEach((comment) => findComment(comment));

        setSelectedPost(b);

        let a = data;
        a[postIndex] = b;

        mutate(a, { revalidate: true });
      } else {
        let c = data[postIndex];
        c.Comment[parentIndex].subComments.push(comment);

        setSelectedPost(c);

        mutate();
      }
    } else {
      setSelectedPost({
        ...data[postIndex],
        Comment: [...selectedPost.Comment, comment],
      });
      mutate(
        { ...data[postIndex], Comment: [...selectedPost.Comment, comment] },
        { revalidate: true },
      );
    }
    toggleSelectedComment();
  };

  const addComment = async (formData) => {
    if (selectedComment) {
      try {
        const response = await ApiCall.createComment({
          comment: formData.get("comment"),
          postId: null,
          commentId: selectedComment.id,
          email,
        });

        if (!response.status == 200) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        updateComments(selectedPost, {
          id: response.data.id,
          text: formData.get("comment"),
          postId: selectedPost.id,
          subComments: [""],
          selectedCommentId: selectedComment.id,
          User: { email },
        });

        successNotify("Successfully added comment!");
      } catch (e) {
        errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    } else {
      try {
        const response = await ApiCall.createComment({
          comment: formData.get("comment"),
          postId: selectedPost.id,
          email,
        });

        if (!response.status == 200) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        updateComments(selectedPost, {
          id: response.data.id,
          text: formData.get("comment"),
          subComments: [""],
          postId: selectedPost.id,
          User: { email },
        });

        successNotify("Successfully added comment!");
      } catch (e) {
        errorNotify("Failed to add comment!");
        console.log(`Error adding comment: ${e}`);
      }
    }
  };

  const toggleSelectedPost = (post) => {
    setSelectedPost(selectedPost ? null : post);
  };

  const toggleSelectedComment = (comment) => {
    setSelectedComment(comment ? comment : null);
  };

  const toggleComments = () => {
    setCommentsVisible(commentsVisible ? false : true);
  };

  const {
    data,
    error,
    mutate,
    isLoading: loading,
  } = useSWR(import.meta.env.VITE_BACKEND_URL, getPosts, {
    revalidateOnMount: true,
  });

  return (
    <div className={home.body}>
      <div className={home.navigation}>
        <h1 className={text.headingTitle}>Blog API</h1>
        <div className={home.searchContainer}>
          <RiSearch2Line className={icons.search} />
          <input
            type="text"
            name="search"
            id=""
            placeholder="Search"
            className={home.input}
            onChange={searchPosts}
          />
        </div>
        {isLoggedIn && (
          <button
            className={home.button}
            style={{
              display: "flex",
            }}
            onClick={() => nav("/new-post")}
          >
            <IoAdd className={icons.edit} />
          </button>
        )}
      </div>
      <div className={home.container}>
        {loading && <p> Loading...</p>}
        {error && <p>Error</p>}
        {data && (
          <Posts
            data={
              filter
                ? data.filter(
                    (post) =>
                      post.text.toLowerCase().includes(filter.toLowerCase()) ||
                      post.title.toLowerCase().includes(filter.toLowerCase()),
                  )
                : data
            }
            toggleSelectedPost={toggleSelectedPost}
            commentsVisible={commentsVisible}
            toggleComments={toggleComments}
          />
        )}
        {commentsVisible && (
          <div className={comment.container}>
            {selectedPost &&
              commentsVisible &&
              selectedPost.Comment.map((comment) => {
                return (
                  <div key={comment.id}>
                    <Comments
                      updateComments={updateComments}
                      selectedComment={selectedComment}
                      comment={comment}
                      successNotify={successNotify}
                      errorNotify={errorNotify}
                      mutate={mutate}
                      updateSelectedComment={updateSelectedComment}
                      toggleSelectedComment={toggleSelectedComment}
                    />
                  </div>
                );
              })}
            {isLoggedIn ? (
              <form action={addComment} className={home.addComment}>
                <input
                  type="text"
                  name="comment"
                  className={home.input}
                  id=""
                  placeholder="Share your thoughts"
                />
                <button type="submit">
                  <IoIosAddCircleOutline />
                </button>
              </form>
            ) : (
              <div className={home.authCheck}>
                <div className={home.links}>
                  <Link to="/auth/log-in">LogIn</Link>
                  <p className={home.authText}> or </p>
                  <Link to="/auth/sign-up">SignUp</Link>
                </div>
                <p className={home.authText}>to join the conversation</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
