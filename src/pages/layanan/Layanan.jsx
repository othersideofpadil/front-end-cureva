import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, Star, TrendingUp, ArrowRight } from "lucide-react";
import { layananService } from "../../services";
import {
  Card,
  Button,
  Input,
  LoadingSpinner,
  EmptyState,
} from "../../components/common";

const Layanan = () => {
  const [loading, setLoading] = useState(true);
  const [layanan, setLayanan] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredLayanan, setFilteredLayanan] = useState([]);

  useEffect(() => {
    fetchLayanan();
  }, []);

  useEffect(() => {
    if (search) {
      const searchLower = search.toLowerCase();
      setFilteredLayanan(
        layanan.filter(
          (item) =>
            item.nama?.toLowerCase().includes(searchLower) ||
            item.deskripsi?.toLowerCase().includes(searchLower),
        ),
      );
    } else {
      setFilteredLayanan(layanan);
    }
  }, [layanan, search]);

  const fetchLayanan = async () => {
    try {
      const response = await layananService.getAll();
      setLayanan(response.data || []);
    } catch (error) {
      console.error("Failed to fetch layanan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-800"
        >
          Layanan Fisioterapi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 mt-2"
        >
          Pilih layanan yang sesuai dengan kebutuhan Anda
        </motion.p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <Input
          placeholder="Cari layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={Search}
        />
      </div>

      {/* Services Grid */}
      {filteredLayanan.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLayanan.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full flex flex-col">
                {/* Image Placeholder */}
                <div className="aspect-video bg-linear-to-br from-sky-100 to-indigo-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {item.gambar_url ? (
                    <img
                      src={item.gambar_url}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <TrendingUp className="w-16 h-16 text-sky-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {item.nama}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-4">
                    {item.deskripsi ||
                      "Layanan fisioterapi profesional untuk membantu pemulihan Anda."}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {item.durasi || 60} menit
                    </div>
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {item.rating}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400">Mulai dari</p>
                    <p className="text-xl font-bold text-sky-500">
                      Rp {item.harga?.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Link to={`/bookings/new?layanan=${item.id}`}>
                    <Button size="sm">
                      Booking
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={Search}
            title="Layanan tidak ditemukan"
            description="Tidak ada layanan yang sesuai dengan pencarian Anda"
            action={() => setSearch("")}
            actionLabel="Reset Pencarian"
          />
        </Card>
      )}
    </div>
  );
};

export default Layanan;
