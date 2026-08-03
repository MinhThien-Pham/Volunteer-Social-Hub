import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../client.js";
import PostImagesInput from "../components/PostImagesInput.jsx";
import { resolvePostImageUrls } from "../utils/mediaImages.js";
import { DEFAULT_POST_CATEGORY, POST_CATEGORIES } from "../constants/postCategories.js";

const CreatePost = ({ session }) => {
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
    category: DEFAULT_POST_CATEGORY,
  });

  const [images, setImages] = useState([]);
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

    try {
      const imageUrls = await resolvePostImageUrls(
        images,
        session.user.id,
      );

      const { error } = await supabase.from("posts").insert({
        author_id: session.user.id,
        title: trimmedTitle,
        content: post.content.trim() || null, 
        category: post.category,       
        image_urls: imageUrls,
        upvotes: 0,
      });

      if (error) {
        throw error;
      }

      navigate("/");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
          <label htmlFor="post-category">Category</label>

          <select
            id="post-category"
            name="category"
            value={post.category}
            onChange={handleChange}
          >
            {POST_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <PostImagesInput
          idPrefix="create-post"
          images={images}
          onImagesChange={setImages}
          onMessage={setMessage}
          disabled={isSubmitting}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating post..." : "Create Post"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}
    </section>
  );
};

export default CreatePost;