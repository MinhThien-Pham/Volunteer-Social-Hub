import { Link, useNavigate } from "react-router";
import Avatar from "./Avatar.jsx";
import ImageCarousel from "./ImageCarousel.jsx";

const Card = ({ post }) => {
  const navigate = useNavigate();
  const authorName = post.author?.display_name ?? "Unknown member";
  const commentCount = post.comments?.length ?? 0;
  const handleCardClick = (event) => {
    const interactiveElement = event.target.closest("a, button, input, textarea, select");

    if (interactiveElement) {
      return;
    }

    navigate(`/posts/${post.id}`);
  };

  return (
    <article className="post-card post-card-clickable" onClick={handleCardClick}>
      <header className="post-card-header">
        <Link
          className="post-card-avatar-link"
          to={`/profiles/${post.author_id}`}
          aria-label={`View ${authorName}'s profile`}
        >
          <Avatar className="post-card-avatar" src={post.author?.avatar_url} name={authorName} />
        </Link>

        <div className="post-card-byline">
          <Link className="post-card-author" to={`/profiles/${post.author_id}`}>
            {authorName}
          </Link>

          <span className="post-card-time">{new Date(post.created_at).toLocaleString()}</span>
        </div>

        <span className="post-card-category">{post.category}</span>
      </header>

      <div className="post-card-text">
        <h2 className="post-card-title">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
        </h2>

        {post.content && <p className="post-card-content">{post.content}</p>}
      </div>

      <ImageCarousel
        className="post-card-carousel"
        imageUrls={post.image_urls ?? []}
        title={post.title}
        linkTo={`/posts/${post.id}`}
      />

      <footer className="post-card-footer">
        <span className="post-card-votes">↑ {post.upvotes}</span>

        <Link className="post-card-comments" to={`/posts/${post.id}`}>
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </Link>
      </footer>
    </article>
  );
};

export default Card;
