import React from "react";

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  price?: number;
  isGroup?: boolean;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isInRange: boolean;
  isDisabled: boolean;
  onClick: (date: Date) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  isCurrentMonth,
  price,
  isGroup,
  isSelectedStart,
  isSelectedEnd,
  isInRange,
  isDisabled,
  onClick,
}) => {
  const dayNumber = date.getDate();
  const isSelected = isSelectedStart || isSelectedEnd;

  let textClasses =
    "text-[16px] sm:text-[20px] font-bold z-30 leading-tight transition-colors";
  let priceClasses =
    "text-[9px] sm:text-[11px] font-bold z-30 mt-[-1px] transition-colors";

  if (!isCurrentMonth) {
    textClasses += " text-[#D1D5DB]";
    priceClasses += " opacity-0";
  } else if (isSelected) {
    textClasses += " text-white";
    priceClasses += " text-white";
  } else if (isDisabled && !isInRange) {
    textClasses += " text-[#D1D5DB]";
    priceClasses += " opacity-0";
  } else {
    textClasses += " text-black";
    // Group bo'lsa yashil (#84CC16), aks holda qizil (#EF4444)
    priceClasses += isGroup ? " text-[#84CC16]" : " text-[#EF4444]";
  }

  const selectionHeight = "h-[80%]";

  return (
    <div
      className={`relative aspect-square flex items-center justify-center w-full ${isDisabled ? "cursor-default opacity-50" : "cursor-pointer"}`}
      onClick={() => !isDisabled && onClick(date)}
    >
      {/* 1. Uzluksiz fon qatlami (Range Connector) */}
      {(isInRange || isSelected) && (
        <div className="absolute inset-0 flex items-center z-10">
          <div className={`${selectionHeight} w-full relative`}>
            {isInRange && !isSelected && (
              <div className="w-full h-full bg-[#E8F5E9] border-y border-[#B2DFDB]" />
            )}
            {isSelectedStart && !isSelectedEnd && (
              <div className="absolute right-0 w-1/2 h-full bg-[#E8F5E9] border-y border-[#B2DFDB]" />
            )}
            {isSelectedEnd && !isSelectedStart && (
              <div className="absolute left-0 w-1/2 h-full bg-[#E8F5E9] border-y border-[#B2DFDB]" />
            )}
          </div>
        </div>
      )}

      {/* 2. Tanlangan kun "Pill" */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            className={`
            w-[85%] h-[85%] aspect-square
            bg-[#74B611] border border-[#5F950E]
            flex flex-col items-center justify-center
            shadow-sm
            rounded-[20%]
          `}
          ></div>
        </div>
      )}

      {/* 3. Matnlar */}
      <div className="relative flex flex-col items-center justify-center z-30 pointer-events-none">
        <span className={textClasses}>{dayNumber}</span>
        {price !== undefined && isCurrentMonth && !isDisabled && price !== 0 && (
          <span className={priceClasses}>{price} $</span>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
