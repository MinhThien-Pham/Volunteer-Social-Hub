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
    <section>
      {message && <p role="alert">{message}</p>}

      {author?.avatar_url && (
        <img
          src={author.avatar_url}
          alt={`${authorName} avatar`}
          onError={handleBrokenImage}
        />
      )}

      <p>By {authorName}</p>
      <p>{new Date(post.created_at).toLocaleString()}</p>

      <h1>{post.title}</h1>

      {post.content && <p>{post.content}</p>}

      {post.image_url && (
        <img
          src={post.image_url}
          alt={`Attachment for ${post.title}`}
          onError={handleBrokenImage}
        />
      )}

      <p>↑ {post.upvotes}</p>

      {isOwner && (
        <div>
          <Link to={`/posts/${post.id}/edit`}>Edit Post</Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      )}
    </section>
  );
};

export default PostDetail;