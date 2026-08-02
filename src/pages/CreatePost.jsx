import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../client.js";

const CreatePost = ({ session }) => {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
    image_url: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!session) {
      setMessage("You must log in before creating a post.");
      return;
    }

    if (!trimmedTitle) {
      setMessage("Title is required.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.from("posts").insert({
      author_id: session.user.id,
      title: trimmedTitle,
      content: post.content.trim() || null,
      image_url: post.image_url.trim() || null,
      upvotes: 0,
    });

    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate("/");
  };

  return (
    <section>
      <h1>Create Post</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            name="title"
            type="text"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="post-content">Content</label>
          <textarea
            id="post-content"
            name="content"
            value={post.content}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="post-image-url">Image URL</label>
          <input
            id="post-image-url"
            name="image_url"
            type="url"
            value={post.image_url}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating post..." : "Create Post"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}
    </section>
  );
};

export default CreatePost;