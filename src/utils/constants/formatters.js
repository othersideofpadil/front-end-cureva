export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatTime = (t) => t?.slice(0, 5) || "";

export const formatCurrency = (value) =>
  `Rp. ${Number(value || 0).toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
