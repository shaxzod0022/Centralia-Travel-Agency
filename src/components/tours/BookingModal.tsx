"use client";
import GroupBookingModal from "./GroupBookingModal";
import PrivateBookingModal from "./PrivateBookingModal";
import { Option } from "@/interfaces/calendar.interface";

interface BookingModalProps {
  tourId: number;
  isOpen: boolean;
  onClose: () => void;
  tourOption: Option;
  selectedDate: Date | null;
  participants: {
    adults: number;
    children: number;
    infants: number;
  };
  selectedAddOns?: Record<number, number>;
}

export default function BookingModal({
  isOpen,
  onClose,
  tourOption,
  selectedDate,
  participants,
  selectedAddOns = {},
  tourId,
}: BookingModalProps) {
  if (!isOpen) return null;

  // Group tour bo'lsa
  if (tourOption.type === "group") {
    return (
      <GroupBookingModal
        tourId={tourId}
        isOpen={isOpen}
        onClose={onClose}
        tourOption={tourOption}
        selectedDate={selectedDate}
        participants={participants}
      />
    );
  }

  // Private tour bo'lsa
  return (
    <PrivateBookingModal
      tourId={tourId}
      isOpen={isOpen}
      onClose={onClose}
      tourOption={tourOption}
      selectedDate={selectedDate}
      participants={participants}
      selectedAddOns={selectedAddOns}
    />
  );
}
