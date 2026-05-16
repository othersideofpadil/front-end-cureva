import api from "./api";

const jadwalService = {
  // Get default schedule per day
  getDefault: async () => {
    const response = await api.get("/jadwal/default");
    return response.data;
  },

  // Get available dates
  getAvailableDates: async () => {
    const response = await api.get("/jadwal/available-dates");
    return response.data;
  },

  // Get available slots for a specific date
  getAvailable: async (tanggal) => {
    const response = await api.get(`/jadwal/available/${tanggal}`);
    return response.data;
  },

  // Public: Get all slots for a date
  getSlotsPublic: async (tanggal) => {
    const response = await api.get(`/jadwal/slots-public/${tanggal}`);
    return response.data;
  },

  // Admin: Get all slots for a date
  getSlots: async (tanggal) => {
    const response = await api.get(`/jadwal/slots/${tanggal}`);
    return response.data;
  },

  // Admin: Update default schedule for a day
  updateDefault: async (hari, data) => {
    const response = await api.put(`/jadwal/default/${hari}`, data);
    return response.data;
  },

  // Admin: Generate slots for date range
  generateSlots: async (data) => {
    const response = await api.post("/jadwal/generate", data);
    return response.data;
  },

  // Admin: Block a slot
  blockSlot: async (id) => {
    const response = await api.post(`/jadwal/slot/${id}/block`);
    return response.data;
  },

  // Admin: Unblock a slot
  unblockSlot: async (id) => {
    const response = await api.post(`/jadwal/slot/${id}/unblock`);
    return response.data;
  },

  // Admin: Set holiday
  setHoliday: async (tanggal) => {
    const response = await api.post(`/jadwal/libur/${tanggal}`);
    return response.data;
  },

  // Admin: Cancel holiday
  cancelHoliday: async (tanggal) => {
    const response = await api.delete(`/jadwal/libur/${tanggal}`);
    return response.data;
  },
};

export default jadwalService;
