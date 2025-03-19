import react from 'react';

export default function Notification() {
    const fakeNotifications = [
        { id: 1, image: "https://via.placeholder.com/50", name: "Test Work 1" },
        { id: 2, image: "https://via.placeholder.com/50", name: "Test Work 2" },
        { id: 3, image: "https://via.placeholder.com/50", name: "Test Work 3" },
      ];
    return (
        <div className="absolute top-15 right-0 bg-white shadow-lg rounded-xl w-64 p-4 z-1">
                <h3 className="text-gray-700 font-semibold mb-2">
                  Notifications
                </h3>
                {fakeNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center mb-2 border-b pb-2"
                  >
                    <img
                      src={notif.image}
                      alt={notif.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="ml-2 flex-1 text-[12px] text-gray-700">
                      {notif.name}
                    </span>
                    <button className="bg-green-400 text-white px-2 py-1 rounded text-xs mr-1 ml-2">
                      Submit
                    </button>
                    <button className="bg-red-400 text-white px-2 py-1 rounded text-xs">
                      Deny
                    </button>
                  </div>
                ))}
              </div>
    );
}