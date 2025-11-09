import { useContext, useState } from "react";
import comments from "../styles/comments.module.css";
import text from "../styles/text.module.css";
import home from "../styles/home.module.css";
import icons from "../styles/icons.module.css";
import { GoTriangleUp } from "react-icons/go";
import { GoTriangleDown } from "react-icons/go";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { GoReply } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";
import AuthContext from "../AuthContext";
import ApiCall from "../apiCalls";
import { ToastContainer, toast, Bounce } from "react-toastify";
import SelectionContext from "../selectionContext";

const Comments = ({
  toggleSelectedComment,
  selectedComment,
  updateSelectedComment,
  comment,
  mutate,
  updateComments,
}) => {
  const [open, setOpen] = useState(true);

  const { selectedPost } = useContext(SelectionContext);

  const [editing, setEditing] = useState(false);

  const { email } = useContext(AuthContext);

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

  const deleteComment = async (commentId) => {
    const confirm = await ApiCall.deleteComment({ commentId });
    confirm.status == 200
      ? successNotify("Comment deleted successfully")
      : errorNotify("Failed to delete comment!");
  };

  const updateComment = async (formData, comment) => {
    const editedText = formData.get("editedText");

    const confirm = await ApiCall.updateComment({
      commentId: formData.get("commentId"),
      text: editedText,
    });

    if (confirm.status == 200) {
      toggleSelectedComment(comment);

      updateSelectedComment({ editedText });

      comment.text = formData.get("editedText");

      mutate({ revalidate: true });

      toggleEditing();

      successNotify("Comment updated successfully");
    } else {
      errorNotify("Failed to update comment!");
    }
  };

  const toggleOpen = () => {
    setOpen(open ? false : true);
  };

  const toggleEditing = () => {
    setEditing(editing ? false : true);
  };

  return (
    <div key={comment.id}>
      <div
        className={comments.comment}
        style={{
          borderLeft:
            selectedComment && comment.id === selectedComment.id
              ? "1px solid oklch(50% 0.6 218)"
              : "1px solid oklch(0.6424 0.032 260.37)",
        }}
      >
        <div className={comments.content}>
          <p className={comments.email}>{comment.User.email}</p>
          {editing ? (
            <form
              action={(formData, event) =>
                updateComment(formData, comment, event)
              }
              className={comments.edit}
            >
              <input type="hidden" value={comment.id} name="commentId" />
              <input
                type="text"
                name="editedText"
                defaultValue={comment.text}
                className={home.input}
              />
              <button
                className={home.button}
                type="submit"
                style={{ display: "flex" }}
              >
                <FaCheck className={icons.edit} />
              </button>
            </form>
          ) : (
            <p className={text.baseText}>{comment.text}</p>
          )}
          {comment.edited && (
            <p style={{ marginTop: 20, color: "grey", fontStyle: "italic" }}>
              Edited
            </p>
          )}
        </div>
        <div className={comments.actions}>
          {comment.User.email === email && (
            <div className={comments.actions}>
              <span
                onClick={() => deleteComment(comment.id)}
                className={icons.commentDelete}
              >
                <MdDeleteOutline />
              </span>
              <span onClick={toggleEditing} className={icons.commentEdit}>
                <FiEdit2 />
              </span>
            </div>
          )}
          <div
            style={{ fontSize: 20, color: "grey" }}
            onClick={() => toggleSelectedComment(comment)}
          >
            <GoReply />
          </div>
        </div>
        <span onClick={toggleOpen} className={comments.expand}>
          {!open ? <GoTriangleDown /> : <GoTriangleUp />}
        </span>
      </div>
      {comment.subComments &&
        comment.subComments[0] != "" &&
        comment.subComments.map((c) => {
          return (
            <div
              style={{
                display: open ? "block" : "none",
                paddingLeft: 25,
              }}
            >
              <Comments
                toggleSelectedComment={toggleSelectedComment}
                selectedComment={selectedComment}
                updateSelectedComment={updateSelectedComment}
                comment={c}
                mutate={mutate}
                selectedPost={selectedPost}
                updateComments={updateComments}
              />
            </div>
          );
        })}
      <ToastContainer />
    </div>
  );
};

export default Comments;
