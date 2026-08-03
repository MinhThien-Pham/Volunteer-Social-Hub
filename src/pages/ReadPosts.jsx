import { useEffect, useState } from "react";
import { supabase } from "../client.js";
import Card from "../components/Card.jsx";
import { POST_CATEGORIES } from "../constants/postCategories.js";

const ReadPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setMessage("");

      let query = supabase
        .from("posts")
        .select("id, title, category, upvotes, created_at");

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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesCategory =
      categoryFilter === "All" ||
      post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="feed-page">
      <h1>Community Posts</h1>

      <div className="feed-toolbar">
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
          <label htmlFor="post-category-filter">Category</label>

          <select
            id="post-category-filter"
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
          >
            <option value="All">All Categories</option>

            {POST_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
      </div>

      {isLoading && <p>Loading posts...</p>}

      {!isLoading && message && <p role="alert">{message}</p>}

      {!isLoading && !message && posts.length === 0 && (
        <p>No posts yet.</p>
      )}

      {!isLoading &&
        !message &&
        posts.length > 0 &&
        filteredPosts.length === 0 && <p>No posts match your current filters.</p>}

      <div className="post-list">
        {!isLoading &&
          !message &&
          filteredPosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
      </div>
    </section>
  );
};

export default ReadPosts;