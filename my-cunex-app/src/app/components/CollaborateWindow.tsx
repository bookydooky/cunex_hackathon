import React, { useState } from 'react';
import { IoIosRemoveCircleOutline } from "react-icons/io";

interface PopupWindowProps {
  isVisible: boolean;
  onClose: () => void;
}

const PopupWindow: React.FC<PopupWindowProps> = ({ isVisible, onClose }) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState<string>('');
  const handleAddMember = () => {
    if (newMember.trim() !== '') {
      setTeamMembers([...teamMembers, newMember]);
      setNewMember('');
    }};

  const handleRemoveMember = (index: number) => {
        const updatedMembers = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(updatedMembers);
      };
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full rounded-lg shadow-lg flex flex-col px-8 py-8">
        <div className="flex justify-center">
            <h2 className="text-xl text-black font-bold mb-6">Collaborate with Others</h2>
        </div>
        <div className='mb-3'>
            <h2 className="text-gray-600 mb-1">Add Team Members</h2>
            <input
              type="email"
              placeholder="Email address"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg"/>
            <button className="mt-2 bg-pink-500 text-white font-semibold text-sm px-4 py-1 rounded-full"
              onClick={handleAddMember}>
                Add
            </button>
        </div>
        <div className='mb-3'>
          <h2 className="text-gray-600 mb-1">Current Team Members</h2>
          {teamMembers.length > 0 ? (
            <div className="flex flex-col gap-y-5 bg-gray-100 px-6 py-4 rounded-lg">
              {teamMembers.map((member, index) => {
                const firstName = member.split(' ')[0];
                return (
                  <div key={index} className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='bg-gray-500 w-8 h-8 rounded-full'/>
                      <div className='flex flex-col ml-3'>
                        <span className='text-gray-800'>{member}</span>
                        <span className='text-gray-500 text-sm'>{firstName}@example.com</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(index)}
                      className="ml-4 bg-red-500 text-white font-semibold text-sm px-2 py-1 rounded-full flex items-center"
                    >
                      <IoIosRemoveCircleOutline className="text-white text-xl font-bold"/>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No team members added yet.</p>
          )}
        </div>
        <button onClick={onClose} className="mt-4 bg-pink-500 text-white py-2 px-4 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupWindow;