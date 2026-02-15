import { Star, StarHalf, StarOff } from "lucide-react";

const Stars = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex gap-0.5">
      {[...Array(full)].map((_, i) => (
        <Star
          key={"f" + i}
          className="w-4 h-4 text-yellow-500 fill-yellow-500"
        />
      ))}

      {half && (
        <div className="relative w-5 h-5">
          {/* gray background star */}
          <Star className="w-4 h-4 text-gray-400" />

          {/* yellow half overlay */}
          <Star
            className="w-4 h-4 text-yellow-500 fill-yellow-500 absolute top-0 left-0"
            style={{
              clipPath: "inset(0 50% 0 0)", // chap tomoni ko‘rinadi
            }}
          />
        </div>
      )}

      {[...Array(empty)].map((_, i) => (
        <Star key={"e" + i} className="w-4 h-4 text-gray-400" />
      ))}
    </div>
  );
};

export default Stars;
