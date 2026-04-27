import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1a1829] text-gray-300 border-t border-gray-700 mt-10">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white font-playfair">
              SpeakUp
            </h2>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Improve your English speaking skills with daily practice, words,
              verbs, and structured lessons. Build confidence step by step.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition">
                  Progress
                </Link>
              </li>
              <li>
                <Link to="/words" className="hover:text-white transition">
                  Words
                </Link>
              </li>
              <li>
                <Link to="/verbs" className="hover:text-white transition">
                  Verbs
                </Link>
              </li>
            </ul>
          </div>

          {/* Motivation / Quote */}
          <div>
            <h3 className="text-white font-bold mb-3">Daily Motivation</h3>
            <p className="text-sm text-gray-400 italic">
              “The more you speak, the more confident you become. Keep
              practicing every day — small steps lead to big progress.”
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-semibold">SpeakUp</span>. All
            rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms
            </a>
            <a href="#" className="hover:text-white transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
