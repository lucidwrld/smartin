import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Upload, Trash2 } from "lucide-react";

const VoiceRecorder = ({ 
  onRecordingComplete, 
  existingRecording = null,
  maxFileSizeMB = 10,
  maxDurationMinutes = 5,
  acceptedFormats = "audio/*"
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(existingRecording);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (existingRecording) {
      setAudioBlob(existingRecording);
      setAudioUrl(URL.createObjectURL(existingRecording));
    }
  }, [existingRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        onRecordingComplete(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop recording if max duration reached
          if (newTime >= maxDurationMinutes * 60) {
            stopRecording();
            alert(`Recording stopped automatically after ${maxDurationMinutes} minutes`);
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordingTime(0);
    onRecordingComplete(null);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSizeMB) {
        alert(`File size too large. Maximum allowed size is ${maxFileSizeMB}MB`);
        return;
      }
      
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      onRecordingComplete(file);
    } else {
      alert("Please select a valid audio file");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <div className="text-center space-y-4">
        {!audioBlob ? (
          <>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRecording
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square size={20} />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic size={20} />
                      <span>Start Recording</span>
                    </>
                  )}
                </button>
                
                <span className="text-sm text-gray-600">or</span>
                
                <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload size={20} />
                  <span>Upload Audio</span>
                  <input
                    type="file"
                    accept={acceptedFormats}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {isRecording && (
                <div className="text-sm text-gray-600">
                  Recording: {formatTime(recordingTime)}
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              Record your voice invitation or upload an existing audio file
              <br />
              <span className="text-xs">Max: {maxDurationMinutes} min, {maxFileSizeMB}MB</span>
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause size={20} />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    <span>Play</span>
                  </>
                )}
              </button>
              
              <button
                onClick={deleteRecording}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={20} />
                <span>Delete</span>
              </button>
            </div>
            
            <p className="text-sm text-green-600 font-medium">
              Voice recording ready!
            </p>
          </>
        )}
      </div>
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  );
};

export default VoiceRecorder;