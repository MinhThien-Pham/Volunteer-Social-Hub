import { supabase } from "../client.js";

export const MAX_POST_IMAGES = 6;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_DIMENSION = 4096;

const MEDIA_BUCKET = "community-media";

const getImageDimensions = (source) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    const timeoutId = window.setTimeout(() => {
      image.src = "";
      reject(new Error("The image took too long to load."));
    }, 10000);

    image.onload = () => {
      window.clearTimeout(timeoutId);

      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };

    image.onerror = () => {
      window.clearTimeout(timeoutId);
      reject(new Error("The image could not be loaded."));
    };

    image.src = source;
  });

const validateDimensions = ({ width, height }) => {
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    throw new Error(`Images cannot exceed ${MAX_IMAGE_DIMENSION} × ${MAX_IMAGE_DIMENSION} pixels.`);
  }
};

export const validateLocalImage = async (file) => {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not an image.`);
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`${file.name} is larger than 5 MB.`);
  }

  const previewUrl = URL.createObjectURL(file);

  try {
    const dimensions = await getImageDimensions(previewUrl);
    validateDimensions(dimensions);
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
};

export const validateImageUrl = async (value) => {
  const trimmedUrl = value.trim();

  let parsedUrl;

  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    throw new Error("Enter a valid image URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Image URLs must use http or https.");
  }

  let dimensions;

  try {
    dimensions = await getImageDimensions(trimmedUrl);
  } catch {
    throw new Error(
      "The URL did not load as an image. Use a direct image URL instead of a gallery page.",
    );
  }

  validateDimensions(dimensions);

  return trimmedUrl;
};

const getFileExtension = (file) => {
  const mimeExtensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/svg+xml": "svg",
  };

  if (mimeExtensions[file.type]) {
    return mimeExtensions[file.type];
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (fileExtension && /^[a-z0-9]+$/.test(fileExtension)) {
    return fileExtension;
  }

  return null;
};

const uploadImage = async ({ file, filePath, upsert = false }) => {
  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, file, { cacheControl: "3600", contentType: file.type, upsert });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error("The uploaded image URL could not be created.");
  }

  return data.publicUrl;
};

export const uploadPostImage = async (file, userId) => {
  const extension = getFileExtension(file);

  const uniqueName = extension ? `${crypto.randomUUID()}.${extension}` : crypto.randomUUID();

  return uploadImage({ file, filePath: `${userId}/posts/${uniqueName}` });
};

export const uploadAvatarImage = async (file, userId) => {
  const publicUrl = await uploadImage({ file, filePath: `${userId}/avatars/avatar`, upsert: true });

  return `${publicUrl}?v=${Date.now()}`;
};

export const resolvePostImageUrls = async (images, userId) => {
  const imageUrls = [];

  for (const image of images) {
    if (image.kind === "url") {
      imageUrls.push(image.url);
    } else {
      const uploadedUrl = await uploadPostImage(image.file, userId);
      imageUrls.push(uploadedUrl);
    }
  }

  return imageUrls;
};
