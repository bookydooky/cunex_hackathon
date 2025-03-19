import React, { useState } from "react";
import { IoIosRemoveCircleOutline } from "react-icons/io";

interface PopupWindowProps {
  isVisible: boolean;
  onClose: () => void;
}

const PopupWindow: React.FC<PopupWindowProps> = ({ isVisible, onClose }) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<string>("");
  const [newSearchMember, setNewSearchMember] = useState<string>("");
  const [newSearchTotal, setNewSearchTotal] = useState<string>("");
  const handleAddMember = () => {
    if (newMember.trim() !== "") {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember("");
    }
  };

  const handleSearchMember = () => {
    const newSearch = `###${newSearchMember} ${newSearchTotal}`;
    if (newSearch.trim() !== "") {
      setTeamMembers([...teamMembers, newSearch]);
      setNewSearchMember("");
      setNewSearchTotal("");
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
  };
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full rounded-lg shadow-lg flex flex-col px-8 py-8">
        <div className="flex justify-center">
          <h2 className="text-xl text-black font-bold mb-6">
            Collaborate with Others
          </h2>
        </div>
        <div className="mb-3">
          <h2 className="text-gray-600 mb-1">Add Team Members</h2>
          <input
            type="email"
            placeholder="Email address"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg"
          />
          <button
            className="mt-2 bg-pink-500 text-white text-sm px-4 py-1 rounded-full
             transition-colors duration-200 ease-in-out hover:bg-pink-600 active:bg-pink-700"
            onClick={handleAddMember}
          >
            Add
          </button>
        </div>
        <h2 className="text-gray-600 mb-1">Search Team Members</h2>
        <div className="flex space-x-4">
          <div className="relative w-1/2">
            <select
              name="workType"
              className="w-full p-3 border border-gray-300 rounded-lg appearance-none text-black"
              onChange={(e) => setNewSearchMember(e.target.value)}
              value={newSearchMember}
            >
              <option value="" disabled>
                Select work type
              </option>
              <option value="UXUI">UX/UI</option>
              <option value="Coding">Coding</option>
              <option value="Graphic">Graphics</option>
              <option value="Video">Video</option>
              <option value="Tutoring">Tutoring</option>
              <option value="Language">Language</option>
              <option value="Modeling">Modeling</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="relative w-1/20">
            <select
              name="collaborators"
              className="w-full p-3 border border-gray-300 rounded-lg appearance-none text-black"
              onChange={(e) => setNewSearchTotal(e.target.value)}
              value={newSearchTotal}
            >
              <option value="" disabled>
                No. of collaborators
              </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <button
            className="mt-2 bg-pink-500 text-white text-sm px-4 py-1 rounded-full
             transition-colors duration-200 ease-in-out hover:bg-pink-600 active:bg-pink-700"
            onClick={handleSearchMember}
          >
            Add
          </button>
        </div>
        <div className="mb-3">
          <h2 className="text-gray-600 mb-1">Current Team Members</h2>
          {teamMembers.length > 0 ? (
            <div className="flex flex-col gap-y-5 bg-gray-100 px-6 py-4 rounded-lg">
              {teamMembers.map((member, index) => {
                let workTypeOrName = member.split(" ")[0]; // First word (either "###WorkType" or Name)
                let numOrLastName = member.split(" ")[1]; // Second word (either number or last name)

                let isSearchFormat = workTypeOrName.startsWith("###");

                if (isSearchFormat) {
                  workTypeOrName = workTypeOrName.slice(3); // Remove "###"
                }
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-500 w-8 h-8 rounded-full" />
                      <div className="flex flex-col ml-3">
                        {isSearchFormat ? (
                          // Case 1: "###WorkType num"
                          <>
                            <span className="text-gray-800">
                              {workTypeOrName}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {numOrLastName} People
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-800">{member}</span>
                            <span className="text-gray-500 text-sm">
                              {member.split(" ")[0]}@example.com
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(index)}
                      className="ml-4 bg-red-500 text-white font-semibold text-sm px-2 py-1 rounded-full flex items-center
                      transition-colors duration-200 ease-in-out hover:bg-red-600 active:bg-red-700"
                    >
                      <IoIosRemoveCircleOutline className="text-white text-xl font-bold" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No team members added yet.</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onClose}
            className="mt-4 bg-gray-100 text-gray-400 py-2 px-4 rounded-lg flex-1
           transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-500 active:bg-gray-300 active:text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="mt-4 bg-pink-500 text-white py-2 px-4 rounded-lg flex-1
          transition-colors duration-200 ease-in-out hover:bg-pink-600 active:bg-pink-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupWindow;
