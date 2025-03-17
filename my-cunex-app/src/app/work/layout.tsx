'use client'
import React, { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react';

interface WorkDetailLayoutProps {
  children: ReactNode;
}

const WorkLayout: React.FC<WorkDetailLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname= usePathname();
  const [selectedTab, setSelectedTab] = useState(pathname); 

  useEffect(() => {
    setSelectedTab(pathname);
  }, [pathname]);
  
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col h-screen bg-white mx-auto shadow-lg relative">
      {/* App Header */}
      <div className="px-4 py-5 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => handleNavigation('/')} 
          className="text-gray-700 transition-transform transform active:scale-90">
            <ArrowLeft className="mr-4 text-pink-500 hover:text-pink-600" />
          </button>
          <div className="flex items-center">
            <div className="font-bold text-lg">
              <span className="text-pink-500">CU</span>
              <span className="text-gray-700">NEX</span>
            </div>
            <div className="h-6 border-l border-gray-300 mx-5"></div>
            <div className="text-pink-500 text-xl font-medium">Logo Design</div>
          </div>
        </div>
        <Share2 className="text-gray-700" />
      </div>

      {/* Logo Image Carousel */}
      <div className="bg-gray-100 relative py-6">
        <div className="flex justify-center items-center">
          <button className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          
          <div className="w-64 h-64 relative mx-auto">
            <div className="absolute inset-0 flex justify-center items-center bg-white shadow-sm rounded-lg">
              <div className="text-center p-4">
                <div className="flex justify-center mb-3">
                  <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="featherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7928CA" />
                        <stop offset="50%" stopColor="#FF0080" />
                        <stop offset="100%" stopColor="#FF8C00" />
                      </linearGradient>
                    </defs>
                    <path d="M130,30 C150,40 160,60 160,80 C160,100 140,120 120,130 C100,140 80,130 60,110 C40,90 20,70 30,50 C40,30 60,20 80,30 C100,40 110,20 130,30 Z" fill="url(#featherGradient)" />
                    <path d="M80,100 C90,90 100,80 110,90 C120,100 130,110 120,120 C110,130 100,120 90,110 C80,100 70,110 80,100 Z" fill="#3B82F6" />
                  </svg>
                </div>
                <div className="font-bold uppercase text-xl">LOREM <span className="font-normal">IPSUM</span></div>
              </div>
            </div>
          </div>
          
          <button className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b">
        <button onClick={() => handleNavigation('/work/detail')}
        className={`flex-1 text-center py-3 ${selectedTab === '/work/detail' ? 'text-pink-500 border-b-2 border-pink-500 font-medium' : 'text-gray-500 hover:text-pink-500'}`}>
          Detail
        </button>
        <button onClick={() => handleNavigation('/work/about')}
        className={`flex-1 text-center py-3 ${selectedTab === '/work/about' ? 'text-pink-500 border-b-2 border-pink-500  font-medium' : 'text-gray-500 hover:text-pink-500'}`}>
          About
        </button>
        <button onClick={() => handleNavigation('/work/feedback')}
        className={`flex-1 text-center py-3 ${selectedTab === '/work/feedback' ? 'text-pink-500 border-b-2 border-pink-500  ont-medium' : 'text-gray-500 hover:text-pink-500'}`}>
          Feedback
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto mx-2 pb-16">
        {children}
      </div>
      <div className='absolute bottom-0 left-0 right-0 p-4 h-20 bg-white flex items-center space-x-4'>
                <button className="flex-grow bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg font-medium">
                  Request Design
                </button>
      
                {/* Chat Button */}
                <div className="flex-shrink-0 bg-white rounded-full p-3 shadow-lg border border-gray-200">
                  <MessageCircle size={24} className="text-gray-600" />
                </div>
      </div>
    </div>
  );
};

export default WorkLayout;