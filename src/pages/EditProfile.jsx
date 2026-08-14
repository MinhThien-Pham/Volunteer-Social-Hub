import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../client.js";
import { uploadAvatarImage, validateImageUrl, validateLocalImage } from "../utils/mediaImages.js";

const EditProfile = ({ session, onProfileUpdated }) => {
  const navigate = useNavigate();
  const userId = session?.user?.id;

  const [profile, setProfile] = useState({ display_name: "", avatar_url: "", bio: "" });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");
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

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
  };

  const handleAvatarFileSelected = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setMessage("");

    try {
      await validateLocalImage(file);

      setAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));

      setProfile((currentProfile) => ({ ...currentProfile, avatar_url: "" }));
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAvatarUrlChange = (event) => {
    setAvatarFile(null);
    setAvatarPreviewUrl("");

    setProfile((currentProfile) => ({ ...currentProfile, avatar_url: event.target.value }));
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreviewUrl("");

    setProfile((currentProfile) => ({ ...currentProfile, avatar_url: "" }));

    setMessage("");
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

    try {
      let avatarUrl = profile.avatar_url.trim() || null;

      if (avatarFile) {
        avatarUrl = await uploadAvatarImage(avatarFile, userId);
      } else if (avatarUrl) {
        avatarUrl = await validateImageUrl(avatarUrl);
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          display_name: trimmedDisplayName,
          avatar_url: avatarUrl,
          bio: profile.bio.trim() || null,
        })
        .eq("id", userId)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { display_name: trimmedDisplayName },
      });

      if (metadataError) {
        console.error("Profile saved, but Auth metadata was not updated:", metadataError.message);
      }

      onProfileUpdated(data);
      navigate(`/profiles/${userId}`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section>
        <h1>Edit Profile</h1>
        <p>Loading profile...</p>
      </section>
    );
  }

  const avatarSource = avatarPreviewUrl || profile.avatar_url;

  const avatarInitial = profile.display_name.trim().charAt(0).toUpperCase() || "?";

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

        <div className="avatar-editor">
          <span className="avatar-editor-label">Avatar</span>

          {avatarSource ? (
            <img className="avatar-editor-preview" src={avatarSource} alt="Avatar preview" />
          ) : (
            <div
              className="avatar-editor-preview avatar-editor-placeholder"
              aria-label="Avatar preview"
            >
              {avatarInitial}
            </div>
          )}

          <div>
            <label htmlFor="profile-avatar-file">Upload from your device</label>

            <input
              id="profile-avatar-file"
              type="file"
              accept="image/*"
              onChange={handleAvatarFileSelected}
              disabled={isSubmitting}
            />

            <small>One image, up to 5 MB and no larger than 4096 × 4096 pixels.</small>
          </div>

          <div>
            <label htmlFor="profile-avatar-url">Or use an image URL</label>

            <input
              id="profile-avatar-url"
              type="url"
              value={profile.avatar_url}
              onChange={handleAvatarUrlChange}
              placeholder="https://example.com/avatar.jpg"
              disabled={isSubmitting}
            />
          </div>

          {avatarSource && (
            <button type="button" onClick={handleRemoveAvatar} disabled={isSubmitting}>
              Remove Avatar
            </button>
          )}
        </div>

        <div>
          <label htmlFor="profile-bio">Bio</label>

          <textarea id="profile-bio" name="bio" value={profile.bio} onChange={handleChange} />
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
