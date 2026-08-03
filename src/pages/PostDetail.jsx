import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { supabase } from "../client.js";
import ImageCarousel from "../components/ImageCarousel.jsx";

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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [savingCommentId, setSavingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
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

  const startEditingComment = (comment) => {
    if (session?.user?.id !== comment.author_id) {
      setMessage("You can only edit your own comment.");
      return;
    }

    setMessage("");
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleCommentUpdate = async (event, comment) => {
    event.preventDefault();

    if (session?.user?.id !== comment.author_id) {
      setMessage("You can only edit your own comment.");
      return;
    }

    const trimmedContent = editingCommentContent.trim();

    if (!trimmedContent) {
      setMessage("Comment cannot be empty.");
      return;
    }

    setMessage("");
    setSavingCommentId(comment.id);

    const { data, error } = await supabase
      .from("comments")
      .update({
        content: trimmedContent,
      })
      .eq("id", comment.id)
      .eq("author_id", session.user.id)
      .select("id, content")
      .maybeSingle();

    setSavingCommentId(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data) {
      setMessage("Comment could not be updated.");
      return;
    }

    setComments((currentComments) =>
      currentComments.map((currentComment) =>
        currentComment.id === data.id
          ? {
              ...currentComment,
              content: data.content,
            }
          : currentComment,
      ),
    );

    cancelEditingComment();
  };

  const handleCommentDelete = async (comment) => {
    if (session?.user?.id !== comment.author_id) {
      setMessage("You can only delete your own comment.");
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!shouldDelete) {
      return;
    }

    setMessage("");
    setDeletingCommentId(comment.id);

    const { data, error } = await supabase
      .from("comments")
      .delete()
      .eq("id", comment.id)
      .eq("author_id", session.user.id)
      .select("id")
      .maybeSingle();

    setDeletingCommentId(null);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data) {
      setMessage("Comment could not be deleted.");
      return;
    }

    setComments((currentComments) =>
      currentComments.filter(
        (currentComment) => currentComment.id !== data.id,
      ),
    );

    if (editingCommentId === comment.id) {
      cancelEditingComment();
    }
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
  const imageUrls = post.image_urls ?? [];

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

      <p className="post-author">
        By{" "}
        <Link to={`/profiles/${post.author_id}`}>
          {authorName}
        </Link>
      </p>
      <p className="post-time">
        {new Date(post.created_at).toLocaleString()}
      </p>

      <h1>{post.title}</h1>

      {post.content && <p className="post-content">{post.content}</p>}

      <ImageCarousel
        imageUrls={imageUrls}
        title={post.title}
      />

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
          comments.map((comment) => {
            const isCommentOwner =
              session?.user?.id === comment.author_id;

            const isEditing =
              editingCommentId === comment.id;

            const isSaving =
              savingCommentId === comment.id;

            const isDeleting =
              deletingCommentId === comment.id;

            return (
              <article className="comment-card" key={comment.id}>
                <p className="comment-author">
                  <Link to={`/profiles/${comment.author_id}`}>
                    {comment.author?.display_name ?? "Unknown member"}
                  </Link>
                </p>

                <p className="comment-time">
                  {new Date(comment.created_at).toLocaleString()}
                </p>

                {isEditing ? (
                  <form
                    className="comment-edit-form"
                    onSubmit={(event) =>
                      handleCommentUpdate(event, comment)
                    }
                  >
                    <textarea
                      value={editingCommentContent}
                      onChange={(event) =>
                        setEditingCommentContent(event.target.value)
                      }
                      aria-label="Edit comment"
                      disabled={isSaving}
                    />

                    <div className="comment-edit-actions">
                      <button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save"}
                      </button>

                      <button
                        className="comment-cancel-button"
                        type="button"
                        onClick={cancelEditingComment}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="comment-content">{comment.content}</p>

                    {isCommentOwner && (
                      <div className="comment-actions">
                        <button
                          className="comment-action-button"
                          type="button"
                          onClick={() => startEditingComment(comment)}
                          disabled={isDeleting}
                        >
                          Edit
                        </button>

                        <button
                          className="comment-action-button comment-delete-button"
                          type="button"
                          onClick={() => handleCommentDelete(comment)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
            );
          })
        )}
      </section>
    </section>
  );
};

export default PostDetail;