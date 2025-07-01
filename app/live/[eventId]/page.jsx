"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Vote, MessageSquare, Users, TrendingUp, Send, Check } from "lucide-react";
import CustomButton from "@/components/Button";

const LivePollsQA = () => {
  const { eventId } = useParams();
  const [activeContent, setActiveContent] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [userName, setUserName] = useState("");
  const [question, setQuestion] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  // Mock data - in real implementation, fetch from API
  const [eventData, setEventData] = useState({
    name: "Tech Conference 2024",
    activePoll: {
      id: "poll_1",
      title: "Which session topic interests you most?",
      description: "Help us prioritize upcoming sessions",
      options: [
        { id: "opt_1", text: "AI & Machine Learning", votes: 45, percentage: 42 },
        { id: "opt_2", text: "Web Development", votes: 32, percentage: 30 },
        { id: "opt_3", text: "Mobile Apps", votes: 20, percentage: 19 },
        { id: "opt_4", text: "Cloud Computing", votes: 10, percentage: 9 }
      ],
      totalVotes: 107,
      isActive: true,
      allowMultiple: false
    },
    activeQA: {
      id: "qa_1",
      title: "Live Q&A Session",
      description: "Ask questions to our speakers",
      questions: [
        {
          id: "q_1",
          text: "How do you handle scalability in microservices?",
          author: "Anonymous",
          likes: 23,
          isAnswered: true,
          answer: "Great question! We use Docker containers and Kubernetes for orchestration..."
        },
        {
          id: "q_2", 
          text: "What's the best way to learn React in 2024?",
          author: "John D.",
          likes: 15,
          isAnswered: false
        },
        {
          id: "q_3",
          text: "Any recommendations for API testing tools?",
          author: "Anonymous",
          likes: 8,
          isAnswered: false
        }
      ],
      isActive: true,
      allowAnonymous: true
    }
  });

  useEffect(() => {
    // Check if there's an active poll or Q&A
    if (eventData.activePoll?.isActive) {
      setActiveContent('poll');
    } else if (eventData.activeQA?.isActive) {
      setActiveContent('qa');
    }
  }, [eventData]);

  const handleVote = async (optionId) => {
    if (userVote && !eventData.activePoll?.allowMultiple) return;
    
    setUserVote(optionId);
    // In real implementation: await submitVote({ pollId: eventData.activePoll.id, optionId });
    
    // Update vote counts (mock)
    setEventData(prev => ({
      ...prev,
      activePoll: {
        ...prev.activePoll,
        options: prev.activePoll.options.map(opt => 
          opt.id === optionId 
            ? { ...opt, votes: opt.votes + 1 }
            : opt
        ),
        totalVotes: prev.activePoll.totalVotes + 1
      }
    }));
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim()) return;
    
    const newQuestion = {
      id: `q_${Date.now()}`,
      text: question,
      author: userName || "Anonymous", 
      likes: 0,
      isAnswered: false
    };
    
    setSubmittedQuestions(prev => [newQuestion, ...prev]);
    setQuestion("");
    
    // In real implementation: await submitQuestion({ qaId: eventData.activeQA.id, question: newQuestion });
  };

  const handleLikeQuestion = (questionId) => {
    setEventData(prev => ({
      ...prev,
      activeQA: {
        ...prev.activeQA,
        questions: prev.activeQA.questions.map(q =>
          q.id === questionId ? { ...q, likes: q.likes + 1 } : q
        )
      }
    }));
  };

  const allQuestions = [...(eventData.activeQA?.questions || []), ...submittedQuestions]
    .sort((a, b) => b.likes - a.likes);

  if (!activeContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{eventData.name}</h1>
          <p className="text-gray-600">No active polls or Q&A sessions at the moment.</p>
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
          <h1 className="text-xl font-bold text-gray-900">{eventData.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{eventData.activePoll?.totalVotes || 0} participants</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Content Toggle */}
        {eventData.activePoll?.isActive && eventData.activeQA?.isActive && (
          <div className="flex bg-white rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveContent('poll')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                activeContent === 'poll' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Vote className="w-4 h-4" />
              Live Poll
            </button>
            <button
              onClick={() => setActiveContent('qa')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
                activeContent === 'qa' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Q&A
            </button>
          </div>
        )}

        {/* Live Poll */}
        {activeContent === 'poll' && eventData.activePoll && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{eventData.activePoll.title}</h2>
              <p className="text-gray-600">{eventData.activePoll.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>{eventData.activePoll.totalVotes} votes</span>
                {userVote && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="w-3 h-3" />
                    You voted
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {eventData.activePoll.options.map((option) => {
                const isSelected = userVote === option.id;
                const percentage = eventData.activePoll.totalVotes > 0 
                  ? Math.round((option.votes / eventData.activePoll.totalVotes) * 100)
                  : 0;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={userVote && !eventData.activePoll.allowMultiple}
                    className={`w-full relative p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : userVote 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <span className={`font-medium ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
                        {option.text}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{option.votes} votes</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="absolute inset-0 bg-purple-100 rounded-lg opacity-20" 
                         style={{ width: `${percentage}%` }}></div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Q&A Session */}
        {activeContent === 'qa' && eventData.activeQA && (
          <div className="space-y-6">
            {/* Submit Question */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{eventData.activeQA.title}</h2>
              <p className="text-gray-600 mb-4">{eventData.activeQA.description}</p>
              
              <div className="space-y-3">
                {eventData.activeQA.allowAnonymous && (
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                )}
                
                <textarea
                  placeholder="Ask your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                
                <CustomButton
                  buttonText="Submit Question"
                  prefixIcon={<Send className="w-4 h-4" />}
                  buttonColor="bg-purple-600"
                  radius="rounded-md"
                  onClick={handleSubmitQuestion}
                  disabled={!question.trim()}
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Questions ({allQuestions.length})</h3>
              
              <div className="space-y-4">
                {allQuestions.map((q) => (
                  <div key={q.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{q.text}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>by {q.author}</span>
                          {q.isAnswered && (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <Check className="w-3 h-3" />
                              Answered
                            </span>
                          )}
                        </div>
                        {q.answer && (
                          <div className="mt-3 p-3 bg-green-50 rounded-md">
                            <p className="text-sm text-green-800">{q.answer}</p>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleLikeQuestion(q.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{q.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {allQuestions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No questions yet. Be the first to ask!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePollsQA;