'use client'
import React from 'react';
import { ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WorkFeedback = () => {
  const router = useRouter();
  const handlePreviousPage = () => {
    router.push('/');
  };

  return (

     <p>Feedback</p>

  );
};

export default WorkFeedback;