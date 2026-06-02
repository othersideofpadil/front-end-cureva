import { motion } from "framer-motion";

const StatCards = ({ statCards }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {statCards.map((stat, index) => {
      const Icon = stat.icon;
      return (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5"
        >
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${stat.lightColor}`}>
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color.replace("bg-", "text-")}`}
              />
            </div>
            <a
              href={stat.href}
              className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              Lihat
            </a>
          </div>
          <div className="mt-4">
            <p className="text-xl sm:text-2xl font-bold text-slate-800">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-slate-500">{stat.title}</p>
            {stat.caption && (
              <p className="text-xs text-slate-400 mt-1">{stat.caption}</p>
            )}
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default StatCards;
