
import { Option } from '@/interfaces/calendar.interface';
import React from 'react';

interface TourSelectorProps {
  options: Option[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const TourSelector: React.FC<TourSelectorProps> = ({ options, selectedId, onSelect }) => {
  return (
    <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${selectedId === option.id
            ? 'bg-white text-[#84CC16] shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          {option.name}
        </button>
      ))}
    </div>
  );
};

export default TourSelector;
