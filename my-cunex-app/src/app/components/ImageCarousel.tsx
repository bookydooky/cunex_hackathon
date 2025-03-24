import React, { useState } from "react";
import Image from "next/image";
import { X } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      {/* Modal for full image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <button
              className="absolute top-2 right-2 text-red-400"
              onClick={() => setIsModalOpen(false)}
            >
              <X/>
            </button>
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt || "Full image"}
              layout="responsive"
              width={1280}
              height={1280}
              className="max-h-[70vh] object-contain"
            />
        </div>
      )}

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
                <Image
                  src={image.src}
                  alt={image.alt || "Carousel image"}
                  layout="responsive"
                  width={1280}
                  height={1280}
                  className="max-h-[30vh] object-contain cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
                {image.caption && (
                  <div className="text-center mt-4 font-bold text-xl">
                    {image.caption}
                  </div>
                )}
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
