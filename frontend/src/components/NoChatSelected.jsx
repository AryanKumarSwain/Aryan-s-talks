
import swainT from "/swainT.png";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
       <div className="flex justify-center mb-4">
  <img
  src={swainT}
  alt="Talks Logo"
 className="max-w-none"

/>

</div>



        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Talks</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start Talks
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
