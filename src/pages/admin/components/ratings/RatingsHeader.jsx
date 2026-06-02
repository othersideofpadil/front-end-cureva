import { Star } from "lucide-react";

const RatingsHeader = ({ ratingsCount, averageRating }) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
        Kelola Rating & Review
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        Perbarui atau hapus ulasan untuk menjaga kualitas layanan.
      </p>
    </div>
    <div className="flex items-center gap-3">
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-center">
        <p className="text-[11px] text-slate-400">Total Ulasan</p>
        <p className="text-lg font-semibold text-slate-800">{ratingsCount}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-center">
        <p className="text-[11px] text-slate-400">Rata-rata</p>
        <div className="flex items-center justify-center gap-1 text-amber-500">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-lg font-semibold text-slate-800">
            {averageRating}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default RatingsHeader;
