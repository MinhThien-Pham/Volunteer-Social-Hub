import { useEffect, useState } from "react";
import { supabase } from "../client.js";
import Card from "../components/Card.jsx";

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, upvotes, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      setPosts(data ?? []);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <section>
        <h1>Community Posts</h1>
        <p>Loading posts...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Community Posts</h1>

      {message && <p role="alert">{message}</p>}

      {!message && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </section>
  );
};

export default ReadPosts;