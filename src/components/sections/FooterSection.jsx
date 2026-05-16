import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const FooterSection = ({ layanan }) => {
  const year = new Date().getFullYear();

  const navLinks = [
    { label: "Fisioterapis", href: "#fisioterapis" },
    { label: "Layanan", href: "#services" },
    { label: "Ulasan", href: "#reviews" },
  ];

  const socials = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer id="contact" className="bg-slate-900 text-white">
      {/* ── thin accent line ── */}
      <div className="h-px bg-linear-to-r from-transparent via-sky-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand — spans full width on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/images/logo.png"
                alt="Cureva"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-lg font-bold tracking-tight">Cureva</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Layanan homecare fisioterapi profesional untuk pemulihan dan kesehatan
              gerak anda.
            </p>
            <div className="flex gap-2.5">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">
              Layanan
            </h4>
            <ul className="space-y-2.5">
              {(layanan || []).slice(0, 5).map((item) => (
                <li key={item.id}>
                  <a
                    href="#services"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.nama}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">
              Menu
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-4">
              Kontak
            </h4>
            <ul className="space-y-3">
              {[
                {
                  icon: Phone,
                  text: "+62 812-3456-7890",
                  href: "tel:+6281234567890",
                },
                {
                  icon: Mail,
                  text: "hello@cureva.id",
                  href: "mailto:hello@cureva.id",
                },
              ].map(({ icon: Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-sky-500 group-hover:text-sky-400" />
                    {text}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-slate-400">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-500 mt-0.5" />
                <span>
                  Jl. Kesehatan No. 123
                  <br />
                  Jakarta Selatan, 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {year} Cureva. All rights reserved.</p>
          <p>Layanan homecare fisioterapi terpercaya di Indonesia</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
