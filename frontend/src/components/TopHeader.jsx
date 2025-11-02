import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Search,
  HelpCircle,
} from "lucide-react";
import "../styles/top-header.css";

// Reusable icon button
const IconButton = ({ icon: Icon, label, isDisabled = false }) => (
  <button
    className={`p-1 rounded flex items-center justify-center text-[#d1d2d3] ${
      isDisabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer hover:bg-[#522653]"
    }`}
    aria-label={label}
    disabled={isDisabled}
  >
    <Icon className="w-5 h-5" />
  </button>
);

const TopHeader = ({ workspaceName = "Scaler School Of Technology" }) => {
  return (
    <div className="flex items-center bg-[#3f0e40] text-[#d1d2d3] h-[40px] w-full border-b border-b-[#522653]">
      
      {/* Left Navigation Buttons */}
      <div className="w-[260px] shrink-0 flex items-center justify-end gap-3 pr-5">
        <IconButton icon={ArrowLeft} label="Back" isDisabled={true} />
        <IconButton icon={ArrowRight} label="Forward" isDisabled={true} />
        <IconButton icon={Clock} label="History" />
      </div>

      {/* Middle Search Section */}
      <div className="flex-1 flex items-center justify-between px-4">
        <div className="flex items-center flex-1 max-w-[700px] mx-auto bg-[#522653] border border-[#7c7a7f] rounded-md h-[28px] px-2">
          <input
            type="text"
            placeholder={`Search ${workspaceName}`}
            className="bg-transparent border-none outline-none w-full text-white text-[13px] font-normal placeholder:text-[#d1d2d3] placeholder:opacity-80"
          />
          <Search className="w-4 h-4 text-[#d1d2d3] ml-2 shrink-0" />
        </div>

        {/* Help Button */}
        <IconButton icon={HelpCircle} label="Help" />
      </div>
    </div>
  );
};

export default TopHeader;
