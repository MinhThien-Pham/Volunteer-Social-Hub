import { Link } from "react-router";

const Card = ({ post }) => {
  return (
    <article>
      <p>{new Date(post.created_at).toLocaleString()}</p>

      <h2>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>

      <p>↑ {post.upvotes}</p>
    </article>
  );
};

export default Card;