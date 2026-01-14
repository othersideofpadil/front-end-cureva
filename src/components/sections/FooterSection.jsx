import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const FooterSection = ({ layanan }) => {
  return (
    <footer
      id="contact"
      className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/logo.png"
                alt="Cureva"
                className="w-10 h-10 rounded-xl"
              />
              <span className="text-xl font-bold">Cureva</span>
            </div>
            <p className="text-slate-400 text-sm">
              Layanan fisioterapi home visit profesional untuk kesehatan Anda.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              {layanan.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <a
                    href="#services"
                    className="hover:text-white transition-colors"
                  >
                    {item.nama}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Menu</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a
                  href="#fisioterapis"
                  className="hover:text-white transition-colors"
                >
                  Fisioterapis
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Layanan
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="hover:text-white transition-colors"
                >
                  Ulasan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +62 812-3456-7890
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                hello@cureva.id
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>
                  Jl. Kesehatan No. 123
                  <br />
                  Jakarta Selatan, 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Cureva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
