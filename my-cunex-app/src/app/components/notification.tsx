import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface NotificationProps {
  userId: string;
  setShowNotifications: (show: boolean) => void;
  setShowFeedbackPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedBannerId: React.Dispatch<React.SetStateAction<string>>;
}
interface SubmittedImage {
  historyId: number;
  bannerName: string;
  firstName: string;
  lastName: string;
  imageURL: string;
  submittedImageId: number;
  bannerId: string;
}

export default function Notification({
  userId,
  setShowNotifications,
  setShowFeedbackPopup,
  setClickedBannerId,
}: NotificationProps) {
  const [currentNotis, setCurrentNotis] = useState<SubmittedImage[]>([]);
  const handleCloseNotifications = () => {
    // Hide notifications by setting the state to false
    setShowNotifications(false);
  };
  useEffect(() => {
    if (!userId) return;

    const checkSubmittedImages = async () => {
      try {
        const response = await fetch(
          `/api/getSubmittedImages/?userId=${userId}`
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
  const groupedNotifications: { [key: number]: SubmittedImage[] } = {};
  currentNotis.forEach((notif) => {
    if (!groupedNotifications[notif.historyId]) {
      groupedNotifications[notif.historyId] = [];
    }
    groupedNotifications[notif.historyId].push(notif);
  });

  // Convert the grouped object to an array for rendering
  const historyGroups = Object.entries(groupedNotifications);
  const handleAccept = async (
    historyId: number,
    submittedImageId: number,
    bannerId: string
  ) => {
    try {
      setClickedBannerId(bannerId);

      const response = await fetch(`api/acceptImage`, {
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
      setShowFeedbackPopup(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeny = async (
    historyId: number,
    submittedImageId: number,
    bannerId: string
  ) => {
    try {
      setClickedBannerId(bannerId);
      const response = await fetch(`/api/denyImage`, {
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
      const salesStatus = data.salesStatus;
      if (salesStatus === "SalesParams updated") {
        setShowFeedbackPopup(true);
      }
      console.log("Response:", data);
      handleCloseNotifications();
    } catch (error) {
      console.error("Error:", error);
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
              <Image
                src={notif.imageURL}
                alt={notif.bannerName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="ml-2 flex-1 text-xs text-gray-700">
                {notif.bannerName}
              </span>
              <button
                className="bg-green-400 hover:bg-green-500 active:bg-green-500
                text-white px-2 py-1 rounded text-xs mr-1 ml-2"
                onClick={() =>
                  handleAccept(
                    notif.historyId,
                    notif.submittedImageId,
                    notif.bannerId
                  )
                }
              >
                Accept
              </button>
              <button
                className="bg-red-400 hover:bg-red-500 active:bg-red-500
                text-white px-2 py-1 rounded text-xs"
                onClick={() =>
                  handleDeny(
                    notif.historyId,
                    notif.submittedImageId,
                    notif.bannerId
                  )
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
