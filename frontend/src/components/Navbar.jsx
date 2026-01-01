import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Code } from "lucide-react";
import TalksLogo from "/Talks_logo.png";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                <img
                  src={TalksLogo}
                  alt="Talks Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>

              <h1 className="text-lg font-bold">TALKS.</h1>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">

            {/* Buy Me A Chai */}
            <a
              href="https://buymeachai.ezee.li/swain"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <img
                src="https://buymeachai.ezee.li/assets/images/buymeachai-button.png"
                alt="Buy Me A Chai"
                width="140"
              />
            </a>

            {/* Developer Button */}
            <a
              href="https://swain.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm gap-2"
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Developer</span>
            </a>

            <Link to="/settings" className="btn btn-sm gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="btn btn-sm gap-2"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
