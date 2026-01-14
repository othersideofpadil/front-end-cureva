import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import toast from "react-hot-toast";

const RatingModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  therapistName = "Fisioterapis",
  title = "Beri Penilaian",
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }

    onSubmit({ rating, review });
    setRating(0);
    setReview("");
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Kirim Rating
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Therapist Name */}
        {therapistName && (
          <div className="p-4 bg-sky-50 rounded-xl border border-sky-100">
            <p className="text-sm text-slate-600">Menilai:</p>
            <p className="font-semibold text-slate-900">{therapistName}</p>
          </div>
        )}

        {/* Star Rating */}
        <div className="flex flex-col items-center">
          <p className="text-slate-600 text-center mb-4 font-medium">
            Bagaimana pengalaman Anda?
          </p>
          <div className="flex justify-center gap-3 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-all"
              >
                <Star
                  className={`w-12 h-12 transition-all ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 hover:text-amber-200"
                  }`}
                />
              </motion.button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-sky-600 font-semibold">
              Rating: {rating} dari 5 bintang
            </p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Review (opsional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            placeholder="Bagikan pengalaman Anda dengan fisioterapis ini. Apa yang baik? Apa yang bisa ditingkatkan?"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm resize-none"
          />
          <p className="text-xs text-slate-500 mt-2">
            {review.length} / 500 karakter
          </p>
        </div>

        {/* Help Text */}
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-xs text-slate-600 text-center">
            Rating Anda membantu calon pasien lain membuat keputusan terbaik dan
            memotivasi fisioterapis untuk memberikan layanan terbaik.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export { RatingModal };
export default RatingModal;
