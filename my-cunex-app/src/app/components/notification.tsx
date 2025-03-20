import React from "react";
import { useState, useEffect } from "react";

export default function Notification({ setShowNotifications }) {
  const [currentNotis, setCurrentNotis] = useState(null);
  const session = {
    userId: "100000000000000001",
  };
  const userId = session.userId;
  const handleCloseNotifications = () => {
    // Hide notifications by setting the state to false
    setShowNotifications(false);
  };
  useEffect(() => {
    if (!userId) return;

    const checkSubmittedImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/getSubmittedImages/?userId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to check images");

        const data = await response.json();
        setCurrentNotis(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    checkSubmittedImages();
  }, [userId]);

  if (!currentNotis) return <p>Loading Notification details...</p>;

  // Group notifications by historyId
  const groupedNotifications = {};
  currentNotis.forEach((notif) => {
    if (!groupedNotifications[notif.historyId]) {
      groupedNotifications[notif.historyId] = [];
    }
    groupedNotifications[notif.historyId].push(notif);
  });

  // Convert the grouped object to an array for rendering
  const historyGroups = Object.entries(groupedNotifications);
  const handleAccept = async (historyId, submittedImageId) => {
    try {
      const response = await fetch(`http://localhost:3001/acceptImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ historyId, submittedImageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept image");
      }

      const data = await response.json();
      handleCloseNotifications();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleDeny = async (historyId, submittedImageId) => {
    try {
      const response = await fetch(`http://localhost:3001/denyImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ historyId, submittedImageId }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept image");
      }

      const data = await response.json();
      console.log("Response:", data);
      handleCloseNotifications();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  return (
    <div className="absolute top-15 right-0 bg-white shadow-lg rounded-xl w-64 p-4 z-1">
      <h3 className="text-gray-700 font-semibold mb-2">Notifications</h3>

      {historyGroups.map(([historyId, notifications], groupIndex) => (
        <div key={historyId} className="mb-2">
          {/* Add divider if not the first group */}
          {groupIndex > 0 && (
            <div className="border-t-2 border-gray-400 my-3"></div>
          )}

          {/* Render the notifications for this historyId */}
          {notifications.map((notif) => (
            <div
              key={notif.submittedImageId}
              className="flex items-center mb-2 pb-2"
            >
              <img
                src={notif.imageURL}
                alt={notif.bannerName}
                className="w-10 h-10 rounded-full"
              />
              <span className="ml-2 flex-1 text-xs text-gray-700">
                {notif.bannerName}
              </span>
              <button
                className="bg-green-400 text-white px-2 py-1 rounded text-xs mr-1 ml-2"
                onClick={() =>
                  handleAccept(notif.historyId, notif.submittedImageId)
                }
              >
                Accept
              </button>
              <button
                className="bg-red-400 text-white px-2 py-1 rounded text-xs"
                onClick={() =>
                  handleDeny(notif.historyId, notif.submittedImageId)
                }
              >
                Deny
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
