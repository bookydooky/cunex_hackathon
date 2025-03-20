"use client"
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const GATEWAY = "https://your-api.com"; // Replace with actual gateway URL
      const token = "your_token"; // Replace with actual token
      const ClientId = "your_client_id"; // Replace with actual Client ID
      const ClientSecret = "your_client_secret"; // Replace with actual Client Secret

      try {
        const response = await fetch(`${GATEWAY}/profile?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ClientId: ClientId,
            ClientSecret: ClientSecret,
          },
        });

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profile Data</h2>
      {profileData ? (
        <pre>{JSON.stringify(profileData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
