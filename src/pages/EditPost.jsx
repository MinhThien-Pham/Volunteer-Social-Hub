import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { supabase } from "../client.js";
import PostImagesInput from "../components/PostImagesInput.jsx";
import { resolvePostImageUrls } from "../utils/postImages.js";

const EditPost = ({ session }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const [images, setImages] = useState([]);
  const [authorId, setAuthorId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("author_id, title, content, image_urls")
        .eq("id", id)
        .maybeSingle();

      if (!isActive) {
        return;
      }

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (!data) {
        setIsLoading(false);
        return;
      }

      setAuthorId(data.author_id);

      setPost({
        title: data.title,
        content: data.content ?? "",
      });

      const storedImageUrls = data.image_urls ?? [];

      setImages(
        storedImageUrls.map((url) => ({
          id: crypto.randomUUID(),
          kind: "url",
          url,
        })),
      );

      setIsLoading(false);
    };

    fetchPost();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPost((previousPost) => ({
      ...previousPost,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = post.title.trim();

    if (!trimmedTitle) {
      setMessage("Title is required.");
      return;
    }

    if (!session || session.user.id !== authorId) {
      setMessage("You can only edit your own post.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      const imageUrls = await resolvePostImageUrls(
        images,
        session.user.id,
      );

      const { data, error } = await supabase
        .from("posts")
        .update({
          title: trimmedTitle,
          content: post.content.trim() || null,          
          image_urls: imageUrls,
        })
        .eq("id", id)
        .eq("author_id", session.user.id)
        .select("id")
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Post could not be updated.");
      }

      navigate(`/posts/${id}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section>
        <h1>Edit Post</h1>
        <p>Loading post...</p>
      </section>
    );
  }

  if (!authorId) {
    return (
      <section>
        <h1>Post Not Found</h1>

        {message && <p role="alert">{message}</p>}

        <Link to="/">Return Home</Link>
      </section>
    );
  }

  if (session?.user?.id !== authorId) {
    return (
      <section>
        <h1>Edit Post</h1>
        <p role="alert">You cannot edit this post.</p>
        <Link to={`/posts/${id}`}>Return to Post</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="edit-post-title">Title</label>

          <input
            id="edit-post-title"
            name="title"
            type="text"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="edit-post-content">Content</label>

          <textarea
            id="edit-post-content"
            name="content"
            value={post.content}
            onChange={handleChange}
          />
        </div>

        <PostImagesInput
          idPrefix="edit-post"
          images={images}
          onImagesChange={setImages}
          onMessage={setMessage}
          disabled={isSubmitting}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}
    </section>
  );
};

export default EditPost;