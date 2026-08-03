import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { supabase } from "../client.js";
import Card from "../components/Card.jsx";

const Profile = ({ session }) => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      setIsLoading(true);
      setMessage("");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!isActive) {
        return;
      }

      if (profileError) {
        setMessage(profileError.message);
        setIsLoading(false);
        return;
      }

      if (!profileData) {
        setIsLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id, title, category, upvotes, created_at")
        .eq("author_id", id)
        .order("created_at", { ascending: false });

      if (!isActive) {
        return;
      }

      if (postsError) {
        setMessage(postsError.message);
        setPosts([]);
      } else {
        setPosts(postsData ?? []);
      }

      setIsLoading(false);
    };

    fetchProfile();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleBrokenImage = (event) => {
    event.currentTarget.style.display = "none";
  };

  if (isLoading) {
    return (
      <section>
        <h1>Member Profile</h1>
        <p>Loading profile...</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section>
        <h1>Profile Not Found</h1>

        {message && <p role="alert">{message}</p>}

        <Link to="/">Return Home</Link>
      </section>
    );
  }

  const isOwner = session?.user?.id === profile.id;

  return (
    <section className="profile-page">
      {message && <p role="alert">{message}</p>}

      <div className="profile-header">
        {profile.avatar_url && (
          <img
            className="profile-avatar"
            src={profile.avatar_url}
            alt={`${profile.display_name} avatar`}
            onError={handleBrokenImage}
          />
        )}

        <div>
          <h1>{profile.display_name}</h1>

          {profile.bio ? (
            <p className="profile-bio">{profile.bio}</p>
          ) : (
            <p className="profile-bio">No bio yet.</p>
          )}

          {isOwner && <Link to="/profile/edit">Edit Profile</Link>}
        </div>
      </div>

      <section className="profile-posts">
        <h2>Posts</h2>

        {posts.length === 0 ? (
          <p>This member has not created any posts yet.</p>
        ) : (
          <div className="post-list">
            {posts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default Profile;