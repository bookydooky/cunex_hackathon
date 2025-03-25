import React, { useState } from "react";

interface ProfileImageProps {
  profileImageUrl?: string;
  alt?: string;
  className?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  profileImageUrl,
  alt = "User Profile",
  className = "w-24 h-24 rounded-full overflow-hidden border-4 border-Pink",
}) => {
  const [imageError, setImageError] = useState(false);

  // Placeholder SVG as a React component
  const PlaceholderIcon = () => (
    <div className={`${className} flex items-center justify-center`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-1/2 h-1/2 text-gray-300"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 12L11 15L16 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  // If no image URL or image failed to load, show placeholder
  if (!profileImageUrl || imageError) {
    return <PlaceholderIcon />;
  }

  return (
    <img
      src={profileImageUrl}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => setImageError(true)}
    />
  );
};

export default ProfileImage;
