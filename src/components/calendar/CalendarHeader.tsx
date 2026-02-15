
import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  locale: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, locale, onPrevMonth, onNextMonth }) => {
  // Tanlangan tilga qarab oy nomini olish
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long' }).format(currentDate);
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-6 px-2">
      <button 
        onClick={onPrevMonth}
        className="text-[#84CC16] hover:opacity-70 transition-opacity p-2"
        aria-label="Previous Month"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[4px]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <h2 className="text-[22px] font-extrabold text-[#374151] capitalize">
        {monthName} {year}
      </h2>
      
      <button 
        onClick={onNextMonth}
        className="text-[#84CC16] hover:opacity-70 transition-opacity p-2"
        aria-label="Next Month"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current stroke-[4px]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default CalendarHeader;
