import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, CircleHelp } from 'lucide-react';
import '../styles/top-header.css';

const TopHeader = ({ workspaceName = "Scaler School Of Technology" }) => {

  return (
    <div className="top-header">
      {/* Left Side - Navigation Arrows */}
      <div className="top-header__left">
        <button className="top-header__nav-btn" aria-label="Back" disabled>
          <ArrowLeft className="icon-disabled" />
        </button>
        <button className="top-header__nav-btn" aria-label="Forward" disabled>
          <ArrowRight className="icon-disabled" />
        </button>
      </div>

      {/* Center - Search Bar */}
      <div className="top-header__center">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${workspaceName}`}
            className="search-input"
          />
          {/* <button className="search-filter-btn" aria-label="Search filters">
            <SlidersHorizontal className="filter-icon" />
          </button> */}
        </div>
      </div>

      {/* Right Side - Actions & User */}
      <div className="top-header__right">

        <button className="top-header__action-btn" aria-label="Help">
          <CircleHelp className="top-header__icon" />
        </button>
      </div>
    </div>
  );
};

export default TopHeader;