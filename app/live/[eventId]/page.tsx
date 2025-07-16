"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Users, Check, Loader2 } from "lucide-react";
import useGetEventPollsManager from "@/app/events/controllers/polls/getEventPollsController";
import { usePollSubmission } from "@/app/live/hooks/usePollSubmission";

const LiveInteraction = () => {
  const { eventId } = useParams();
  const [userVotes, setUserVotes] = useState({}); // Track votes per poll
  const [pollVoteData, setPollVoteData] = useState({});
  
  // User registration state
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [registrationForm, setRegistrationForm] = useState({ name: "", email: "" });
  
  // Check for specific question ID in URL
  const [specificQuestionId, setSpecificQuestionId] = useState(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('questionId');
    if (questionId) {
      setSpecificQuestionId(questionId);
    }
  }, []);

  // Fetch real polls from API
  const { data: pollsData, isLoading: pollsLoading, refetch: refetchPolls } = useGetEventPollsManager({
    eventId: eventId as string,
    enabled: !!eventId,
  });

  // Poll submission hook
  const { submitVote, isSubmitting, error } = usePollSubmission();

  useEffect(() => {
    // Check if there are polls available and user is registered
    if (isUserRegistered && pollsData?.data && pollsData.data.length > 0) {
      // Initialize vote data for polls
      const voteData = {};
      pollsData.data.forEach(poll => {
        voteData[poll.id] = {
          totalVotes: 0,
          optionVotes: {}
        };
        poll.options.forEach(option => {
          voteData[poll.id].optionVotes[option] = 0;
        });
      });
      setPollVoteData(voteData);
    }
  }, [pollsData, isUserRegistered]);

  const handleUserRegistration = (e) => {
    e.preventDefault();
    
    if (!registrationForm.email.trim()) {
      alert("Please enter your email address.");
      return;
    }
    
    setUserInfo({
      name: registrationForm.name.trim() || "Anonymous",
      email: registrationForm.email.trim()
    });
    setIsUserRegistered(true);
  };
  
  const handleVote = async (pollId, option) => {
    const poll = pollsData?.data.find(p => p.id === pollId);
    if (!poll) return;
    
    // Check if already voted for single-choice polls
    if (userVotes[pollId] && !poll.allow_multiple) return;
    
    try {
      // Submit vote to API using stored user info
      const success = await submitVote(eventId, pollId, option, userInfo.name, userInfo.email);
      
      if (!success) {
        alert("Failed to submit vote. Please try again.");
        return;
      }
      
      // Update local state
      setUserVotes(prev => ({
        ...prev,
        [pollId]: poll.allow_multiple 
          ? [...(prev[pollId] || []), option]
          : option
      }));
      
      // Update vote counts locally
      setPollVoteData(prev => ({
        ...prev,
        [pollId]: {
          totalVotes: prev[pollId].totalVotes + 1,
          optionVotes: {
            ...prev[pollId].optionVotes,
            [option]: prev[pollId].optionVotes[option] + 1
          }
        }
      }));
      
      // Refetch polls to get updated data
      setTimeout(() => refetchPolls(), 1000);
      
      // If poll shows results immediately, show a success message
      if (poll.show_voter_result) {
        // Results will be visible immediately
      } else {
        // Show a thank you message since results are hidden
        setTimeout(() => {
          alert("Thank you for your response! Results will be shared later.");
        }, 500);
      }
    } catch (err) {
      console.error("Error submitting vote:", err);
      alert("Failed to submit vote. Please try again.");
    }
  };

  // Filter polls based on context
  const activePolls = pollsData?.data ? 
    specificQuestionId 
      ? pollsData.data.filter(poll => poll.id === specificQuestionId) // Show only specific question
      : pollsData.data.filter(poll => poll.is_public) // Show only public questions
    : [];

  if (pollsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  // Show registration form if user is not registered
  if (!isUserRegistered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Live Event</h1>
            <p className="text-gray-600">
              {specificQuestionId 
                ? "Please enter your details to answer this question" 
                : "Please enter your details to participate in polls and Q&A"}
            </p>
          </div>
          
          <form onSubmit={handleUserRegistration} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={registrationForm.email}
                onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name (optional)
              </label>
              <input
                type="text"
                value={registrationForm.name}
                onChange={(e) => setRegistrationForm({...registrationForm, name: e.target.value})}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Join Event
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  if (activePolls.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Live Event Interaction</h1>
          <p className="text-gray-600">No active polls or questions at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Live Event Interaction</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {activePolls.length > 0 ? `${activePolls.length} active question${activePolls.length > 1 ? 's' : ''}` : '0 questions'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Participating as:</p>
              <p className="font-medium text-gray-900">{userInfo.name}</p>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
              <button
                onClick={() => setIsUserRegistered(false)}
                className="text-xs text-purple-600 hover:text-purple-700 mt-1"
              >
                Edit Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Available Questions/Polls */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
              {specificQuestionId ? "Question" : "Available Questions"}
            </h2>
            
            {/* All Questions Display */}
            <div className="space-y-8">
              {activePolls.map((poll) => {
                const voteCount = pollVoteData[poll.id]?.totalVotes || 0;
                const hasVoted = userVotes[poll.id];
                
                return (
                  <div key={poll.id} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">{poll.title}</h3>
                      <p className="text-gray-600 mb-2">{poll.description}</p>
                      <p className="text-base font-medium text-gray-900 mb-3">{poll.question}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{voteCount} responses</span>
                        {hasVoted && (
                          <span className="flex items-center gap-1 text-green-600">
                            <Check className="w-3 h-3" />
                            You responded
                          </span>
                        )}
                        {poll.allow_multiple && (
                          <span className="text-purple-600">Multiple selection allowed</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {poll.options.map((option) => {
                        const isSelected = poll.allow_multiple 
                          ? userVotes[poll.id]?.includes(option)
                          : userVotes[poll.id] === option;
                        const optionVoteCount = pollVoteData[poll.id]?.optionVotes[option] || 0;
                        const totalVotes = pollVoteData[poll.id]?.totalVotes || 0;
                        const percentage = totalVotes > 0 
                          ? Math.round((optionVoteCount / totalVotes) * 100)
                          : 0;

                        return (
                          <button
                            key={option}
                            onClick={() => handleVote(poll.id, option)}
                            disabled={isSubmitting || (userVotes[poll.id] && !poll.allow_multiple)}
                            className={`w-full relative p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50'
                                : isSubmitting || (userVotes[poll.id] && !poll.allow_multiple)
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                            }`}
                          >
                            <div className="flex justify-between items-center relative z-10">
                              <span className={`font-medium ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
                                {option}
                              </span>
                              <div className="flex items-center gap-2">
                                {isSubmitting && (
                                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                )}
                                {poll.show_voter_result && hasVoted && (
                                  <>
                                    <span className="text-sm text-gray-600">{optionVoteCount} votes</span>
                                    <span className="text-sm font-medium">{percentage}%</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            {poll.show_voter_result && hasVoted && (
                              <div className="absolute inset-0 bg-purple-100 rounded-lg opacity-20" 
                                   style={{ width: `${percentage}%` }}></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInteraction;