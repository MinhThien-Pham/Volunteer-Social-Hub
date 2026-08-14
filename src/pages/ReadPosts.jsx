import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../client.js";
import Card from "../components/Card.jsx";
import { POST_CATEGORIES } from "../constants/postCategories.js";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "supported", label: "Most Supported" },
];

const ReadPosts = ({ searchInput }) => {
  const [posts, setPosts] = useState([]);
  const [sortOption, setSortOption] = useState("newest");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setMessage("");

      let query = supabase.from("posts").select(`
          id,
          author_id,
          title,
          content,
          category,
          image_urls,
          upvotes,
          created_at,
          author:profiles!posts_author_id_fkey (
            display_name,
            avatar_url
          ),
          comments:comments!comments_post_id_fkey (
            id
          )
        `);

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
    const matchesSearch = post.title.toLowerCase().includes(normalizedSearch);

    const matchesCategory = categoryFilter === "All" || post.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOption)?.label ?? "Newest";

  const handleSortChange = (nextSortOption) => {
    setSortOption(nextSortOption);
    setIsSortMenuOpen(false);
  };

  return (
    <section className="feed-page">
      <div className="feed-topbar">
        <div className="feed-sort">
          <button
            className="feed-sort-trigger"
            type="button"
            onClick={() => setIsSortMenuOpen((currentValue) => !currentValue)}
            aria-haspopup="menu"
            aria-expanded={isSortMenuOpen}
          >
            {activeSortLabel}
            <span aria-hidden="true">⌄</span>
          </button>

          {isSortMenuOpen && (
            <div className="feed-sort-options" role="menu">
              {SORT_OPTIONS.map((option) => (
                <button
                  className={
                    option.value === sortOption
                      ? "feed-sort-option feed-sort-option-active"
                      : "feed-sort-option"
                  }
                  key={option.value}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSortChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link className="create-post-link" to="/posts/new">
          <span aria-hidden="true">+</span>
          Create Post
        </Link>
      </div>

      <div className="category-filter" aria-label="Filter posts by category">
        {["All", ...POST_CATEGORIES].map((category) => (
          <button
            className={
              category === categoryFilter
                ? "category-filter-button category-filter-button-active"
                : "category-filter-button"
            }
            key={category}
            type="button"
            onClick={() => setCategoryFilter(category)}
            aria-pressed={category === categoryFilter}
          >
            {category === "All" ? "All Posts" : category}
          </button>
        ))}
      </div>

      {message && <p role="alert">{message}</p>}

      {isLoading ? (
        <p className="feed-status">Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p className="feed-status">No posts match your current filters.</p>
      ) : (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReadPosts;
