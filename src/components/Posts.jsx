import posts from "../styles/posts.module.css";
import text from "../styles/text.module.css";
import icons from "../styles/icons.module.css";
import { IoCloseOutline } from "react-icons/io5";
import { FaAngleDoubleRight } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { BiSolidComment, BiSolidCommentX } from "react-icons/bi";
import { Link, useNavigate } from "react-router";
import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import { useContext } from "react";
import SelectionContext from "../selectionContext";
import AuthContext from "../AuthContext";

const md = MarkdownIt({
  linkify: false,
  typographer: false,
});

md.use(
  await Shiki({
    theme: "kanagawa-dragon",
  }),
);

export default function Posts({
  data,
  toggleSelectedPost,
  toggleComments,
  commentsVisible,
}) {
  const nav = useNavigate();

  const { isLoggedIn } = useContext(AuthContext);

  const { selectedPost } = useContext(SelectionContext);

  return (
    <div className={posts.container}>
      {selectedPost && (
        <div className={posts.selectedContainer}>
          <div className={posts.actions}>
            <span className={icons.closeIcon} onClick={toggleSelectedPost}>
              <IoCloseOutline />
            </span>
            <div className={icons.comment}>
              {commentsVisible && selectedPost ? (
                <BiSolidCommentX onClick={toggleComments} />
              ) : (
                <BiSolidComment onClick={toggleComments} />
              )}
            </div>
            {isLoggedIn && (
              <span className={icons.closeIcon} onClick={() => nav("new-post")}>
                <AiOutlineEdit />
              </span>
            )}
          </div>
          <div className={posts.selectedPost}>
            <h1>{selectedPost.title}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: md.render(selectedPost.text) }}
            />
          </div>
        </div>
      )}
      {data.length == 0 && <Link to="new-post">New Post</Link>}
      {!selectedPost &&
        data.map((post) => (
          <div className={posts.post} key={post.id}>
            <div className={posts.top}>
              <h3 className={text.h3}>{post.title}</h3>
              <p className={text.author}>{post.writer.email}</p>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: md.render(post.text) }}
              style={{ overflow: "hidden", textOverflow: "ellipsis" }}
            />
            <span
              className={posts.iconButton}
              onClick={() => toggleSelectedPost(post)}
            >
              <FaAngleDoubleRight />
            </span>
          </div>
        ))}
    </div>
  );
}
