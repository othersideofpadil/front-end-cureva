import { AnimatePresence } from "framer-motion";
import RatingCard from "./RatingCard";

const RatingsList = ({ ratings, onEdit, onDelete, formatDate }) => (
  <div className="grid gap-4">
    <AnimatePresence>
      {ratings.map((item) => (
        <RatingCard
          key={item.id_pemesanan}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          formatDate={formatDate}
        />
      ))}
    </AnimatePresence>
  </div>
);

export default RatingsList;
