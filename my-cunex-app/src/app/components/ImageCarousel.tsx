import React, { useState } from "react";
import Image from "next/image";

interface Image {
  src: string;
  alt?: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: Image[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full bg-gray-50">
      {/* Left Arrow */}
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 cursor-pointer
        active:bg-gray-100"
        onClick={goToPrevious}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19l-7-7 7-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main carousel area */}
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="min-w-full flex justify-center items-center p-6"
            >
              <div className="bg-white rounded-lg shadow-sm p-4 max-w-md">
                <Image
                  src={image.src}
                  alt={image.alt || "Carousel image"}
                  layout="responsive"
                  width={1280}
                  height={1280}
                  className="max-h-[300px] max-w-[250px] object-cover"
                />
                {image.caption && (
                  <div className="text-center mt-4 font-bold text-xl">
                    {image.caption}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 cursor-pointer
        active:bg-gray-100"
        onClick={goToNext}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Optional: Dots for navigation */}
      <div className="flex justify-center gap-2 mb-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
