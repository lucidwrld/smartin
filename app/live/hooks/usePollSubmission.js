import { useState } from 'react';
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const usePollSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitVote = async (eventId, pollId, option, voterName, voterEmail) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await AxiosWithToken.post(`/polls/event/${eventId}/${pollId}/submission`, {
        email: voterEmail || "anonymous@example.com",
        name: voterName || "Anonymous",
        response: option
      });
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVote,
    isSubmitting,
    error
  };
};