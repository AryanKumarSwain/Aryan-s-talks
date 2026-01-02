

import swainT from "/swainT.png";
import talksLogo from "/Talks_logo.png";


const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 sm:p-16 bg-base-100/50">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center mb-4">
          {/* Show short logo on mobile, full logo on desktop */}
          <img
            src={talksLogo}
            alt="Talks Logo Short"
            className="block sm:hidden w-20 h-20 object-contain"
          />
          <img
            src={swainT}
            alt="Talks Logo Full"
            className="hidden sm:block max-w-none w-42 h-42 object-contain"
          />
        </div>
        {/* Welcome Text */}
        <h2 className="text-xl sm:text-2xl font-bold">Welcome to Talks</h2>
        <p className="text-base-content/60 text-sm sm:text-base">
          Select a conversation from the sidebar to start Talks
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
