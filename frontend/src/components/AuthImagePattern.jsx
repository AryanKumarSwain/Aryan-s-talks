import STLogo from "/ST.png";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12 overflow-hidden">
      <div className="max-w-md text-center space-y-6">

        {/* Logo with animation */}
        <div className="flex justify-center">
          <img
            src={STLogo}
            alt="Swain Talks Logo"
            className="max-w-none object-contain
                       animate-float
                       drop-shadow-[0_0_30px_rgba(99,102,241,0.25)]"
          />
        </div>

        {/* Animated text */}
        <h2 className="text-3xl font-bold animate-fadeInUp">
          {title}
        </h2>

        <p className="text-base-content/60 leading-relaxed animate-fadeInUp delay-200">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
