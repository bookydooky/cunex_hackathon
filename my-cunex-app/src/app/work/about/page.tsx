'use client'
import React from 'react';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WorkAbout = () => {
  const router = useRouter();
  const handlePreviousPage = () => {
    router.push('/');
  };

  return (

      <p>About</p>

  );
};

export default WorkAbout;