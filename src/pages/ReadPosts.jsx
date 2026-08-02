import { useEffect, useState } from "react";
import { supabase } from "../client.js";
import Card from "../components/Card.jsx";

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setMessage("");

      let query = supabase
        .from("posts")
        .select("id, title, upvotes, created_at");

      if (sortOption === "supported") {
        query = query
          .order("upvotes", { ascending: false })
          .order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (!isActive) {
        return;
      }

      if (error) {
        setPosts([]);
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      setPosts(data ?? []);
      setIsLoading(false);
    };

    fetchPosts();

    return () => {
      isActive = false;
    };
  }, [sortOption]);

  const normalizedSearch = searchInput.trim().toLowerCase();

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(normalizedSearch),
  );

  return (
    <section>
      <h1>Community Posts</h1>

      <div>
        <label htmlFor="post-search">Search Posts</label>
        <input
          id="post-search"
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by title"
        />
      </div>

      <div>
        <label htmlFor="post-sort">Sort Posts</label>
        <select
          id="post-sort"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="supported">Most Supported</option>
        </select>
      </div>

      {isLoading && <p>Loading posts...</p>}

      {!isLoading && message && <p role="alert">{message}</p>}

      {!isLoading && !message && posts.length === 0 && (
        <p>No posts yet.</p>
      )}

      {!isLoading &&
        !message &&
        posts.length > 0 &&
        filteredPosts.length === 0 && <p>No posts match your search.</p>}

      {!isLoading &&
        !message &&
        filteredPosts.map((post) => (
          <Card key={post.id} post={post} />
        ))}
    </section>
  );
};

export default ReadPosts;