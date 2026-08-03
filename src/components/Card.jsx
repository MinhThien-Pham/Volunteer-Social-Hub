import { Link } from "react-router";

const Card = ({ post }) => {
  return (
    <article className="post-card">
      <p className="post-card-category">
        {post.category}
      </p>

      <p className="post-card-time">
        {new Date(post.created_at).toLocaleString()}
      </p>

      <h2 className="post-card-title">
        <Link to={`/posts/${post.id}`}>
          {post.title}
        </Link>
      </h2>

      <p className="post-card-votes">
        ↑ {post.upvotes}
      </p>
    </article>
  );
};

export default Card;