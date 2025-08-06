import React, { FC } from "react";

interface Props {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  myClass?: string;
}

const Btn: FC<Props> = ({ title, disabled, onClick, myClass }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-green-600 text-lg text-center transition-all duration-100 hover:bg-green-700 active:bg-green-600 py-1 px-6 md:py-1.5 md:px-4 xl:py-2.5 xl:px-8 rounded-4xl ${myClass} ${
        disabled ? "cursor-no-drop" : "cursor-pointer"
      }`}
    >
      {disabled ? "Loading" : title}
    </button>
  );
};

export default Btn;
