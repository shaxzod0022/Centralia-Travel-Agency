// components/tour/DesktopView.tsx
"use client";
import { SelectedRange, TourOption } from "@/interfaces/calendar.interface";
import { styles } from "@/styles/styles";
import { Check, MapPin, Users, X, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useState, useEffect } from "react";
import ParticipantsSelector from "./ParticipantsSelector";
import { Link } from "@/i18n/routing";
import BookingModal from "./BookingModal";
import AddOnsSelector from "./AddOnsSelector";
import { AddOns } from "@/interfaces/addOns.interface";
import { TourComplete } from "@/interfaces/tourComplete.interface";
import GlobalCalendar from "../calendar/GlobalCalendar";
import Itenerary from "./Itenerary";
import Faqs from "./Faqs";
import { addToCart, CartItem, updateCartItem } from "@/store/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "@/i18n/routing";
import {
  calculateTotalPrice,
  formatPrice,
  getPriceLabel,
} from "@/utils/pricingUtils";

interface DesktopViewProps {
  generalInfo: TourComplete;
  tourOption?: TourOption;
  addOns?: AddOns[];
}

const DesktopView = ({
  tourOption,
  addOns = [],
  generalInfo,
}: DesktopViewProps) => {
  const t = useTranslations("tourDetails");
  const [selectedOption, setSelectedOption] = useState<number | null>(
    tourOption?.options?.[0]?.id || null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedParticipants, setSelectedParticipants] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [selectedAddOns, setSelectedAddOns] = useState<Record<number, number>>(
    {},
  );
  const [calendarRange, setCalendarRange] = useState<SelectedRange>({
    start: null,
    end: null,
  });
  const [selectedTourType, setSelectedTourType] = useState<
    "group" | "private" | null
  >(null);
  const [availableTourType, setAvailableTourType] = useState<
    "group" | "private" | null
  >(null);
  const router = useRouter();

  if (!tourOption) {
    return <div className="text-center py-10">No tour options available.</div>;
  }

  const dispatch = useDispatch();
  const cartData = useSelector((state: RootState) => state.cart.data);
  const currentCartItem = cartData.find(
    (item) => item.slug === generalInfo.slug,
  );
  const isInCart = !!currentCartItem;

  useEffect(() => {
    if (currentCartItem) {
      // Sanani tiklash
      if (currentCartItem.date) {
        setSelectedDate(new Date(currentCartItem.date));
      }

      // Qatnashchilarni tiklash
      if (currentCartItem.participants) {
        setSelectedParticipants(currentCartItem.participants);
      }

      // Add-ons larni Record formatiga o'tkazib tiklash
      if (currentCartItem.addOns) {
        const addOnsMap = currentCartItem.addOns.reduce(
          (acc, curr) => {
            acc[curr.id] = curr.quantity;
            return acc;
          },
          {} as Record<number, number>,
        );
        setSelectedAddOns(addOnsMap);
      }

      // Yangi maydonlarni tiklash
      setShowOptions(currentCartItem.showOption || false);
      setSelectedTourType(currentCartItem.tourType || null);
      setSelectedOption(currentCartItem.optionId || null);

      if (currentCartItem.calendarRange) {
        setCalendarRange({
          start: currentCartItem.calendarRange.start
            ? new Date(currentCartItem.calendarRange.start)
            : null,
          end: currentCartItem.calendarRange.end
            ? new Date(currentCartItem.calendarRange.end)
            : null,
        });
      }
    }
  }, [currentCartItem?.id]);

  useEffect(() => {
    if (isInCart && currentCartItem && selectedDate && selectedOption) {
      const changes: Partial<CartItem> = {
        date: selectedDate.toISOString(),
        participants: selectedParticipants,
        showOption: showOptions,
        tourType: selectedTourType,
        optionId: selectedOption,
        calendarRange: {
          start: calendarRange.start ? calendarRange.start.toISOString() : null,
          end: calendarRange.end ? calendarRange.end.toISOString() : null,
        },
        addOns: Object.entries(selectedAddOns).map(([id, qty]) => ({
          id: Number(id),
          quantity: qty,
        })),
        meetingPointData: getSelectedOption()?.meetingPoint || null,
        // Narx o'zgargan bo'lsa, uni ham yangilab qo'yamiz
        price: calculateGrandTotal(),
      };

      dispatch(updateCartItem({ id: currentCartItem.id, changes }));
    }
  }, [
    selectedParticipants,
    selectedAddOns,
    selectedOption,
    selectedDate,
    showOptions,
    selectedTourType,
    calendarRange,
  ]);
  const handleSaveToCart = () => {
    if (!selectedDate || !selectedOption) return;

    if (!isInCart) {
      const expiryTime = Date.now() + 29 * 60 * 1000;
      const tourItem = {
        id: `${generalInfo.slug}-${selectedDate.getTime()}`,
        slug: generalInfo.slug,
        calendarRange: {
          start: calendarRange.start ? calendarRange.start.toISOString() : null,
          end: calendarRange.end ? calendarRange.end.toISOString() : null,
        },
        showOption: showOptions,
        tourType: selectedTourType,
        tourId: generalInfo.id,
        price: calculateGrandTotal(),
        date: selectedDate.toISOString(),
        tourTitle: generalInfo.name,
        tourImage: generalInfo.coverImage,
        optionId: selectedOption,
        expiresAt: expiryTime,
        participants: selectedParticipants,
        addOns: Object.entries(selectedAddOns).map(([id, qty]) => ({
          id: Number(id),
          quantity: qty,
        })),
        meetingPointData: getSelectedOption()?.meetingPoint || null,
        pickupLocationData: null,
      };
      dispatch(addToCart(tourItem));
    }
  };

  // 4. Tugma funksiyalari
  const onBookNowClick = () => {
    handleSaveToCart(); // Oldin savatchaga saqlaymiz
    handleBookNow(); // Keyin modalni ochamiz
  };

  const onCartBtnClick = () => {
    if (isInCart) {
      router.push("/cart");
    } else {
      handleSaveToCart();
    }
  };

  // Add-On ni tanlash funksiyasi
  const handleAddOnSelect = (addOnId: number) => {
    setSelectedAddOns((prev) => {
      if (prev[addOnId]) {
        const newState = { ...prev };
        delete newState[addOnId];
        return newState;
      } else {
        return { ...prev, [addOnId]: 1 };
      }
    });
  };

  // Quantity ni o'zgartirish
  const handleQuantityChange = (addOnId: number, quantity: number) => {
    if (quantity < 1) {
      setSelectedAddOns((prev) => {
        const newState = { ...prev };
        delete newState[addOnId];
        return newState;
      });
    } else {
      setSelectedAddOns((prev) => ({
        ...prev,
        [addOnId]: quantity,
      }));
    }
  };

  // Add-Ons larning umumiy narxini hisoblash
  const calculateAddOnsTotal = () => {
    return addOns.reduce((total, addOn) => {
      const quantity = selectedAddOns[addOn.id] || 0;
      if (addOn.chargeType === "per_person") {
        return total + addOn.price * quantity;
      }
      return total + addOn.price * quantity;
    }, 0);
  };

  useEffect(() => {
    if (tourOption?.options?.length > 0 && !selectedOption) {
      setSelectedOption(tourOption?.options[0].id);
    }
  }, [tourOption, selectedOption]);

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
    const opt = tourOption?.options?.find((o) => o.id === optionId);
    if (opt) {
      setSelectedTourType(opt.type as "group" | "private");
    }
    setShowOptions(true);
  };

  const handleDateSelect = ({
    date,
    type,
  }: {
    date: Date;
    type: "group" | "private";
  }) => {
    setSelectedDate(date);
    setSelectedTourType(type);
    setAvailableTourType(type);
    setShowOptions(true);

    if (type === "group") {
      // group bo‘lsa — group option default
      const groupOption = tourOption.options.find((o) => o.type === "group");
      if (groupOption) setSelectedOption(groupOption.id);
    } else {
      // private bo‘lsa — private option
      const privateOption = tourOption.options.find(
        (o) => o.type === "private",
      );
      if (privateOption) setSelectedOption(privateOption.id);
    }
  };

  /* ================= REFACKTORING: PRICING UTILS ================= */

  const { basePrice, seasonalPrice } = calculateTotalPrice(
    tourOption?.options?.find((opt) => opt.id === selectedOption) as any,
    selectedParticipants,
    selectedDate,
  );

  const calculateGrandTotal = () => {
    const addOnsTotal = calculateAddOnsTotal();
    return (seasonalPrice ?? basePrice) + addOnsTotal;
  };

  const handleBookNow = () => {
    if (!selectedOption || !selectedDate) return;
    setShowBookingModal(true);
  };

  const getSelectedOption = () => {
    return tourOption?.options?.find((opt) => opt.id === selectedOption);
  };
  return (
    <>
      <div className={`${styles.paddingCont} xl:flex hidden gap-8`}>
        {/* Left Column - Tour Details */}
        <div className="w-2/3 space-y-8">
          {/* Tour Options - Desktop uchun (har doim ko'rinadi) */}
          {showOptions && (
            <div className="space-y-4 animate-fadeIn">
              {(tourOption?.options || [])
                .filter((opt) => {
                  if (!availableTourType) return true;

                  // Agar private kun bosilgan bo‘lsa — faqat private
                  if (availableTourType === "private") {
                    return opt.type === "private";
                  }

                  // Agar group kun bosilgan bo‘lsa — group + private
                  return true;
                })
                .map((item) => (
                  <div
                    key={item.id}
                    className={`cursor-pointer shadow-lg rounded-xl p-6 space-y-4 transition-all duration-200 border-3 ${
                      selectedOption === item.id
                        ? "border-[#6EBB2D]"
                        : "border-gray-200"
                    }`}
                    onClick={() => handleOptionSelect(item.id)}
                  >
                    <div className={`${styles.flexBetween} w-full items-start`}>
                      <div className="flex items-center gap-3">
                        <h3 className={`${styles.h3}`}>{item.name}</h3>
                        <span
                          className={`bg-[#6EBB2D] font-semibold !text-white ${styles.p} rounded-lg px-3 capitalize`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <div>
                        <h3 className={`${styles.h3}`}>{formatPrice(item)}</h3>
                        <p
                          className={`${styles.p} !leading-4
                        `}
                        >
                          {getPriceLabel(item, t)}
                        </p>
                      </div>
                    </div>

                    <p className={`${styles.p}`}>{item.description}</p>

                    <div className={`${styles.flexBetween}`}>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 text-[#6EBB2D]" />
                        <span className="font-medium">
                          {item.minParticipants} - {item.maxParticipants}{" "}
                          {t("parti")}
                        </span>
                      </div>
                      <p className={`${styles.p} ${styles.flex} gap-1`}>
                        <User className="w-5 text-[#6EBB2D]" />
                        <span>{t("guide")}</span>
                      </p>
                    </div>
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${item.meetingPoint.lat},${item.meetingPoint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#6EBB2D] hover:underline"
                    >
                      <MapPin className="w-4 h-4" />
                      {t("meet")}
                    </Link>
                  </div>
                ))}
            </div>
          )}

          {/* Description Section */}
          <div className="space-y-4">
            <h2 className={`${styles.h2}`}>{t("enjoy")}</h2>
            {/* Short description removed as requested */}
            {generalInfo.longDescription && (
              <p className={`${styles.p}`}>{generalInfo.longDescription}</p>
            )}
          </div>

          {/* Included & Excluded Section */}
          <div className="space-y-4">
            <h2 className={`${styles.h2}`}>{t("incExc")}</h2>
            <p className={`${styles.p}`}>{t("incExcDesc")}</p>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {/* Included */}
              <ul className="space-y-2">
                {generalInfo.tourIncluded?.map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-3 ${styles.span}`}
                  >
                    <Check className="w-5 text-[#6EBB2D] shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Excluded */}
              <ul className="space-y-2">
                {generalInfo.tourExcluded?.map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-3 ${styles.span}`}
                  >
                    <X className="w-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Destinations Section */}
          {generalInfo.destinations && generalInfo.destinations.length > 0 && (
            <div className="space-y-4">
              <h2 className={`${styles.h2}`}>{t("destination")}</h2>
              <div className="flex flex-wrap gap-3">
                {generalInfo.destinations?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 border-2 border-[#6EBB2D] px-4 py-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
                  >
                    <MapPin className="w-5 text-[#6EBB2D]" />
                    <span className="font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights Section */}
          {generalInfo.highlights && generalInfo.highlights.length > 0 && (
            <div className="space-y-4">
              <h2 className={`${styles.h2}`}>{t("highlights")}</h2>
              <div className="space-y-2">
                {generalInfo.highlights?.map((item, idx) => (
                  <div key={idx} className="flex items-start sm:gap-2 gap-1">
                    <span
                      className={`${styles.flexCenter} shrink-0 w-7 h-7 bg-[#E6F4EA] rounded-full p-1`}
                    >
                      <Check className="w-full text-[#6EBB2D]" />
                    </span>
                    <span className={`${styles.p}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generalInfo.tourIncluded &&
            generalInfo.tourIncluded.length !== 0 && (
              <Itenerary data={generalInfo.tourItinerary} />
            )}

          {/* Map Section */}
          {generalInfo.tourMapLink && (
            <div className="space-y-4">
              <h2 className={`${styles.h2}`}>{t("map")}</h2>
              <p className={`${styles.p}`}>{t("mapDesc")}</p>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={generalInfo.tourMapLink}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tour Map"
                />
              </div>
            </div>
          )}

          {generalInfo.faqs && generalInfo.faqs.length !== 0 && (
            <>
              <h2 className={`${styles.h2} mb-4`}>{t("faqs")}</h2>
              <Faqs data={generalInfo.faqs} />
            </>
          )}
        </div>

        {/* Desktop Right Column */}
        <div className="w-1/3">
          <div className="space-y-4 shadow-lg p-3 rounded-xl">
            {/* Calendar - Desktop */}
            <GlobalCalendar
              tourOptions={tourOption}
              selectedRange={calendarRange}
              onRangeChange={setCalendarRange}
              onDateSelect={handleDateSelect}
            />

            {/* Participants Selector */}
            {showOptions && selectedOption && (
              <ParticipantsSelector
                ageRanges={generalInfo.ageRange}
                selectedOption={tourOption?.options.find(
                  (opt) => opt.id === selectedOption,
                )}
                participants={selectedParticipants}
                onChange={setSelectedParticipants}
              />
            )}

            {/* Add-Ons Selector */}
            {showOptions &&
              selectedOption &&
              selectedDate &&
              addOns.length > 0 && (
                <AddOnsSelector
                  addOns={addOns}
                  selectedAddOns={selectedAddOns}
                  onSelectAddOn={handleAddOnSelect}
                  onQuantityChange={handleQuantityChange}
                  participants={selectedParticipants}
                />
              )}

            {/* Book Now Button - Desktop */}
            {selectedDate && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {/* Add-Ons Price */}
                  {Object.keys(selectedAddOns).length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">
                          {t("addOnsPrice")}
                        </span>
                        <span className="text-lg font-bold text-[#6EBB2D]">
                          ${calculateAddOnsTotal()}
                        </span>
                      </div>
                      {seasonalPrice &&
                      basePrice &&
                      seasonalPrice >= basePrice ? (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {t("tourPrice")}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            ${seasonalPrice}
                          </span>
                        </div>
                      ) : seasonalPrice &&
                        basePrice &&
                        seasonalPrice < basePrice ? (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {t("tourPrice")}
                          </span>
                          <span className="text-xl font-bold text-gray-900">
                            ${seasonalPrice}{" "}
                            <s className="text-sm text-gray-400">
                              ${basePrice}
                            </s>
                          </span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {t("tourPrice")}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            ${basePrice}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Grand Total */}
                  <div className="border-t pt-3 border-gray-400">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">
                        {t("totalPrice")}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${calculateGrandTotal()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onBookNowClick}
                  className="w-full bg-[#6EBB2D] active:bg-[#74c72f] hover:bg-[#5da825] text-white font-bold text-md p-3 rounded-md transition-colors"
                >
                  {t("bookNow")}{" "}
                  <span className="font-bold">${calculateGrandTotal()}</span>
                </button>
                <button
                  onClick={onCartBtnClick}
                  className={`w-full ${isInCart ? "bg-orange-500" : "bg-[#056D50]"} text-white font-semibold text-md p-3 rounded-md transition-colors`}
                >
                  {isInCart ? t("goToCart") : t("cartBtn")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedOption && (
        <BookingModal
          tourId={generalInfo.id}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          tourOption={getSelectedOption()!}
          selectedDate={selectedDate}
          participants={selectedParticipants}
          selectedAddOns={selectedAddOns}
        />
      )}
    </>
  );
};

export default memo(DesktopView);
