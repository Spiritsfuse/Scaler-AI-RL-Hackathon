import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Search,
  HelpCircle,
} from "lucide-react";
import React from "react";

// Helper component for the icons
const IconButton = ({ icon: Icon, label, isDisabled = false }) => (
  <button
    className={`p-1 rounded flex items-center justify-center text-[#d1d2d3] ${
      isDisabled
        ? "opacity-60 cursor-not-allowed" // Disabled styles
        : "cursor-pointer hover:bg-[#522653]" // Enabled + hover styles
    }`}
    aria-label={label}
    disabled={isDisabled}
  >
    {/* Icon size from original .icon class */}
    <Icon className="w-5 h-5" />
  </button>
);

const TopHeader = ({ workspaceName = "Scaler School Of Technology" }) => {
  return (
    // .top-header styles
    <div className="flex items-center bg-[#3f0e40] text-[#d1d2d3] h-[40px] w-full border-b border-b-[#522653]">
      
      {/* PART 1: .top-header__nav-part styles */}
      <div className="w-[260px] shrink-0 flex items-center justify-end gap-3 pr-5">
        <IconButton icon={ArrowLeft} label="Back" isDisabled={true} />
        <IconButton icon={ArrowRight} label="Forward" isDisabled={true} />
        <IconButton icon={Clock} label="History" />
      </div>

      {/* PART 2: .top-header__channel-part styles */}
      <div className="flex-1 flex items-center justify-between px-4">
        
        {/* .search-bar styles */}
        <div className="flex items-center flex-1 max-w-[700px] mx-auto bg-[#522653] border border-[#7c7a7f] rounded-md h-[28px] px-2">
          
          {/* .search-input & placeholder styles */}
          {/* NOTE: Input comes *before* the icon now. */}
          <input
            type="text"
            placeholder={`Search ${workspaceName}`}
            className="bg-transparent border-none outline-none w-full text-white text-[13px] font-normal placeholder:text-[#d1d2d3] placeholder:opacity-80"
          />

          {/* .search-icon styles */}
          {/* NOTE: Icon is on the right with a margin-left */}
          <Search className="w-4 h-4 text-[#d1d2d3] ml-2 shrink-0" />
        </div>

        <IconButton icon={HelpCircle} label="Help" />
      </div>
    </div>
  );
};

export default TopHeader;