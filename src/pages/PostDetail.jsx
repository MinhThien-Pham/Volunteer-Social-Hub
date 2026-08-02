import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { supabase } from "../client.js";

const PostDetail = ({ session }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchPost = async () => {
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!isActive) {
        return;
      }

      if (postError) {
        setMessage(postError.message);
        setIsLoading(false);
        return;
      }

      if (!postData) {
        setIsLoading(false);
        return;
      }

      setPost(postData);

      const { data: authorData, error: authorError } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", postData.author_id)
        .maybeSingle();

      if (!isActive) {
        return;
      }

      if (authorError) {
        console.error("Failed to load post author:", authorError.message);
      }

      setAuthor(authorData ?? null);

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          author_id,
          author:profiles!comments_author_id_fkey (
            display_name
          )
        `)
        .eq("post_id", postData.id)
        .order("created_at", { ascending: true });

      if (!isActive) {
        return;
      }

      if (commentsError) {
        setMessage(commentsError.message);
      } else {
        setComments(commentsData ?? []);
      }

      setIsLoading(false);
    };

    fetchPost();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleBrokenImage = (event) => {
    event.currentTarget.style.display = "none";
  };

  const handleUpvote = async () => {
    if (!session) {
      setMessage("Please log in to support this post.");
      return;
    }

    const nextUpvotes = post.upvotes + 1;

    setMessage("");
    setIsUpvoting(true);

    const { data, error } = await supabase
      .from("posts")
      .update({
        upvotes: nextUpvotes,
      })
      .eq("id", post.id)
      .select("upvotes")
      .single();

    setIsUpvoting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPost((currentPost) => ({
      ...currentPost,
      upvotes: data.upvotes,
    }));
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      setMessage("Please log in to add a comment.");
      return;
    }

    const trimmedContent = commentContent.trim();

    if (!trimmedContent) {
      setMessage("Comment cannot be empty.");
      return;
    }

    setMessage("");
    setIsCommentSubmitting(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: post.id,
        author_id: session.user.id,
        content: trimmedContent,
      })
      .select("id, content, created_at, author_id")
      .single();

    setIsCommentSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    const displayName =
      session.user.user_metadata?.display_name ?? "Unknown member";

    setComments((currentComments) => [
      ...currentComments,
      {
        ...data,
        author: {
          display_name: displayName,
        },
      },
    ]);

    setCommentContent("");
  };

  const handleDelete = async () => {
    const isOwner = session?.user?.id === post.author_id;

    if (!isOwner) {
      setMessage("You can only delete your own post.");
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!shouldDelete) {
      return;
    }

    setMessage("");
    setIsDeleting(true);

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)
      .eq("author_id", session.user.id);

    setIsDeleting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate("/");
  };

  if (isLoading) {
    return (
      <section>
        <h1>Post Detail</h1>
        <p>Loading post...</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section>
        <h1>Post Not Found</h1>

        {message && <p role="alert">{message}</p>}

        <Link to="/">Return Home</Link>
      </section>
    );
  }

  const isOwner = session?.user?.id === post.author_id;
  const authorName = author?.display_name ?? "Unknown member";

  return (
    <section className="post-detail">
      {message && <p role="alert">{message}</p>}

      {author?.avatar_url && (
        <img
          className="avatar-image"
          src={author.avatar_url}
          alt={`${authorName} avatar`}
          onError={handleBrokenImage}
        />
      )}

      <p className="post-author">By {authorName}</p>
      <p className="post-time">
        {new Date(post.created_at).toLocaleString()}
      </p>
      
      <h1>{post.title}</h1>

      {post.content && <p className="post-content">{post.content}</p>}

      {post.image_url && (
        <img
          className="post-image"
          src={post.image_url}
          alt={`Attachment for ${post.title}`}
          onError={handleBrokenImage}
        />
      )}

      <button
        className="vote-button"
        type="button"
        onClick={handleUpvote}
        disabled={isUpvoting}
        aria-label="Add one upward-arrow vote"
      >
        ↑ {post.upvotes}
      </button>

      {isOwner && (
        <div className="post-actions">
          <Link to={`/posts/${post.id}/edit`}>Edit Post</Link>

          <button
            className="danger-button"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      )}
      <section className="comments-section">
        <h2>Comments</h2>

        <form onSubmit={handleCommentSubmit}>
          <div>
            <label htmlFor="comment-content">Add a Comment</label>

            <textarea
              id="comment-content"
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
            />
          </div>

          <button type="submit" disabled={isCommentSubmitting}>
            {isCommentSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <article className="comment-card" key={comment.id}>
              <p className="comment-author">
                {comment.author?.display_name ?? "Unknown member"}
              </p>

              <p className="comment-time">
                {new Date(comment.created_at).toLocaleString()}
              </p>

              <p className="comment-content">{comment.content}</p>
            </article>
          ))
        )}
      </section>
    </section>
  );
};

export default PostDetail;