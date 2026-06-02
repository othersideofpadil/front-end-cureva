import { Star } from "lucide-react";

const StarPicker = ({ value, onChange }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="transition-transform hover:scale-110"
      >
        <Star
          className={`w-8 h-8 ${
            star <= value ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }`}
        />
      </button>
    ))}
  </div>
);

export default StarPicker;
