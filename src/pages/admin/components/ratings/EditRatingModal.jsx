import { Modal, Button } from "../../../../components/common";
import StarPicker from "./StarPicker";

const EditRatingModal = ({
  isOpen,
  onClose,
  rating,
  onRatingChange,
  review,
  onReviewChange,
  onSave,
  saving,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Update Rating"
    footer={
      <>
        <Button variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={onSave} loading={saving}>
          Simpan
        </Button>
      </>
    }
  >
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Rating</p>
        <StarPicker value={rating} onChange={onRatingChange} />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-2">
          Review
        </label>
        <textarea
          value={review}
          onChange={(e) => onReviewChange(e.target.value)}
          rows={4}
          className="w-full px-3.5 py-3 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition"
          placeholder="Perbarui isi review..."
        />
        <p className="text-xs text-slate-400 mt-1 text-right">
          {review.length}/1000
        </p>
      </div>
    </div>
  </Modal>
);

export default EditRatingModal;
