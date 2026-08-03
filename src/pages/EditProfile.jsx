import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../client.js";

const EditProfile = ({ session, onProfileUpdated }) => {
  const navigate = useNavigate();
  const userId = session?.user?.id;

  const [profile, setProfile] = useState({
    display_name: "",
    avatar_url: "",
    bio: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, bio")
        .eq("id", userId)
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
        setMessage("Profile could not be found.");
        setIsLoading(false);
        return;
      }

      setProfile({
        display_name: data.display_name,
        avatar_url: data.avatar_url ?? "",
        bio: data.bio ?? "",
      });

      setIsLoading(false);
    };

    if (userId) {
      fetchProfile();
    }

    return () => {
      isActive = false;
    };
  }, [userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedDisplayName = profile.display_name.trim();

    if (!trimmedDisplayName) {
      setMessage("Display name is required.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("profiles")
      .update({
        display_name: trimmedDisplayName,
        avatar_url: profile.avatar_url.trim() || null,
        bio: profile.bio.trim() || null,
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        display_name: trimmedDisplayName,
      },
    });

    if (metadataError) {
      console.error(
        "Profile saved, but Auth metadata was not updated:",
        metadataError.message,
      );
    }

    onProfileUpdated(data);
    setIsSubmitting(false);
    navigate(`/profiles/${userId}`);
  };

  if (isLoading) {
    return (
      <section>
        <h1>Edit Profile</h1>
        <p>Loading profile...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Edit Profile</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="profile-display-name">Display Name</label>
          <input
            id="profile-display-name"
            name="display_name"
            type="text"
            value={profile.display_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="profile-avatar-url">Avatar URL</label>
          <input
            id="profile-avatar-url"
            name="avatar_url"
            type="url"
            value={profile.avatar_url}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div>
          <label htmlFor="profile-bio">Bio</label>
          <textarea
            id="profile-bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}

      <p>
        <Link to={`/profiles/${userId}`}>Cancel</Link>
      </p>
    </section>
  );
};

export default EditProfile;