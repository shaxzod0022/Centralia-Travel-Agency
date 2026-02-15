"use client";
import { X } from "lucide-react";

interface Props {
  onClick?: () => void;
  newClass?: string;
}

const XBtn = ({ onClick, newClass }: Props) => {
  return (
    <button type="button" className={`${newClass}`} onClick={onClick}>
      <X />
    </button>
  );
};

export default XBtn;
