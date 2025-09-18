import React, { useState, useEffect } from 'react';
 

const CountdownTimer = ({tarDate}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set target date (you can modify this)
     const targetDate = tarDate;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);   

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center">
      {/* Ticket-style container */}
      <div className="relative">
        {/* Main ticket body */}
        <div 
          className="  py-6 pb-7 lg:py-9 lg:pb-10 w-fit px-2 flex items-center justify-center  rounded-lg relative bg-backgroundPurple overflow-hidden shadow-lg"  
        >
          {/* Decorative notches on sides */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
          <div className="absolute  top-1/2   w-full   bg-white h-[1px]"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
            
           
          {/* Time value */}
          <div className="text-white text-2xl lg:text-4xl mt-0 p-0 md:text-[75px] font-bold   tracking-tighter" style={{ fontFamily: 'DIN, Arial, sans-serif' }}>
            {String(value).padStart(2, '0')}
          </div>
        </div>
      </div>
      
      {/* Label below ticket */}
      <div className="mt-3 text-gray-700 text-[14px] font-medium uppercase tracking-wide"
      
>
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap justify-center py-20 gap-6 md:gap-8">
        <style>
        {`
          @font-face {
            font-family: 'DIN';
            src: url('/fonts/DIN-Regular.woff2') format('woff2'),
                 url('/fonts/DIN-Regular.woff') format('woff'),
                 url('/fonts/DIN-Regular.ttf') format('truetype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: 'DIN';
            src: url('/fonts/DIN-Bold.woff2') format('woff2'),
                 url('/fonts/DIN-Bold.woff') format('woff'),
                 url('/fonts/DIN-Bold.ttf') format('truetype');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
        `}
      </style>
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default CountdownTimer;