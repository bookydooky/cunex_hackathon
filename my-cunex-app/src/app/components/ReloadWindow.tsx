import React from 'react';
import { LineWobble } from 'ldrs/react';

const ReloadWindow: React.FC<{ detail: string }> = ({ detail }) => {

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen bg-gray-100">
      <h1 className='text-Pink text-2xl font-semibold text-center'>Loading {detail} Details...</h1>
      <LineWobble color='pink' size={250}/>
    </div>
  );
};

export default ReloadWindow;