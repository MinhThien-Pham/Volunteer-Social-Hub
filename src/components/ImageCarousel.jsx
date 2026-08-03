import { useState } from "react";
import { Link } from "react-router";

const ImageCarousel = ({
  imageUrls = [],
  title,
  linkTo = null,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState([]);

  if (imageUrls.length === 0) {
    return null;
  }

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < imageUrls.length - 1;
  const currentImageFailed = failedIndexes.includes(currentIndex);

  const handleImageError = () => {
    setFailedIndexes((currentIndexes) => {
      if (currentIndexes.includes(currentIndex)) {
        return currentIndexes;
      }

      return [...currentIndexes, currentIndex];
    });
  };

  const showPreviousImage = () => {
    setCurrentIndex((current) => current - 1);
  };

  const showNextImage = () => {
    setCurrentIndex((current) => current + 1);
  };

  return (
    <div className={`image-carousel ${className}`.trim()}>
      <div className="image-carousel-stage">
        {currentImageFailed ? (
          <p className="image-carousel-error">
            This image could not be loaded.
          </p>
        ) : (
          linkTo ? (
            <Link
              className="carousel-image-link"
              to={linkTo}
              aria-label={`Open ${title}`}
            >
              <img
                className="image-carousel-image"
                src={imageUrls[currentIndex]}
                alt={`${title} — image ${currentIndex + 1} of ${
                  imageUrls.length
                }`}
                onError={handleImageError}
              />
            </Link>
          ) : (
            <img
              className="image-carousel-image"
              src={imageUrls[currentIndex]}
              alt={`${title} — image ${currentIndex + 1} of ${
                imageUrls.length
              }`}
              onError={handleImageError}
            />
          )
        )}

        {hasPrevious && (
          <button
            className="carousel-arrow carousel-arrow-left"
            type="button"
            onClick={showPreviousImage}
            aria-label="View previous image"
          >
            ‹
          </button>
        )}

        {hasNext && (
          <button
            className="carousel-arrow carousel-arrow-right"
            type="button"
            onClick={showNextImage}
            aria-label="View next image"
          >
            ›
          </button>
        )}
      </div>

      {imageUrls.length > 1 && (
        <div className="carousel-dots">
          {imageUrls.map((imageUrl, index) => (
            <button
              className={
                index === currentIndex
                  ? "carousel-dot carousel-dot-active"
                  : "carousel-dot"
              }
              key={`${imageUrl}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={
                index === currentIndex ? "true" : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;