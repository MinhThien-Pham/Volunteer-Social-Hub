import { useState } from "react";
import {
  MAX_POST_IMAGES,
  validateImageUrl,
  validateLocalImage,
} from "../utils/postImages.js";

const PostImagesInput = ({
  idPrefix,
  images,
  onImagesChange,
  onMessage,
  disabled,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);

  const handleFilesSelected = async (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    event.target.value = "";

    if (images.length + selectedFiles.length > MAX_POST_IMAGES) {
      onMessage(`A post can have up to ${MAX_POST_IMAGES} images.`);
      return;
    }

    onMessage("");

    try {
      for (const file of selectedFiles) {
        await validateLocalImage(file);
      }

      const newImages = selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        kind: "file",
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      onMessage(error.message);
    }
  };

  const handleAddUrl = async () => {
    if (images.length >= MAX_POST_IMAGES) {
      onMessage(`A post can have up to ${MAX_POST_IMAGES} images.`);
      return;
    }

    if (!imageUrl.trim()) {
      onMessage("Enter an image URL.");
      return;
    }

    onMessage("");
    setIsCheckingUrl(true);

    try {
      const validatedUrl = await validateImageUrl(imageUrl);

      const duplicateUrl = images.some(
        (image) =>
          image.kind === "url" && image.url === validatedUrl,
      );

      if (duplicateUrl) {
        onMessage("That image URL has already been added.");
        return;
      }

      onImagesChange([
        ...images,
        {
          id: crypto.randomUUID(),
          kind: "url",
          url: validatedUrl,
        },
      ]);

      setImageUrl("");
    } catch (error) {
      onMessage(error.message);
    } finally {
      setIsCheckingUrl(false);
    }
  };

  const handleRemove = (imageId) => {
    const imageToRemove = images.find(
      (image) => image.id === imageId,
    );

    if (imageToRemove?.kind === "file") {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    onImagesChange(
      images.filter((image) => image.id !== imageId),
    );
  };

  return (
    <fieldset className="post-images-fieldset" disabled={disabled}>
      <legend>Images</legend>

      <div>
        <label htmlFor={`${idPrefix}-image-files`}>
          Upload from your device
        </label>

        <input
          id={`${idPrefix}-image-files`}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
        />

        <small>
          Up to 6 images. Each image must be 5 MB or smaller and no
          larger than 4096 × 4096 pixels.
        </small>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-image-url`}>
          Or add an image URL
        </label>

        <div className="post-image-url-row">
          <input
            id={`${idPrefix}-image-url`}
            type="url"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="https://example.com/photo.jpg"
          />

          <button
            type="button"
            onClick={handleAddUrl}
            disabled={disabled || isCheckingUrl}
          >
            {isCheckingUrl ? "Checking..." : "Add URL"}
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="post-image-previews">
          {images.map((image, index) => {
            const previewSource =
              image.kind === "file"
                ? image.previewUrl
                : image.url;

            return (
              <article className="post-image-preview" key={image.id}>
                <img
                  src={previewSource}
                  alt={`Post preview ${index + 1}`}
                />

                <span>Image {index + 1}</span>

                <button
                  type="button"
                  onClick={() => handleRemove(image.id)}
                  aria-label={`Remove image ${index + 1}`}
                >
                  Remove
                </button>
              </article>
            );
          })}
        </div>
      )}

      <small>
        {images.length} of {MAX_POST_IMAGES} images selected
      </small>
    </fieldset>
  );
};

export default PostImagesInput;