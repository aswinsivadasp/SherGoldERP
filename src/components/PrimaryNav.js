import React, { useState, useEffect } from 'react';
import '../styles/primaryNavbar.css';
import { useNavigate } from "react-router-dom";


const navItems = [
  { name: 'File', options: [] },
  { name: 'Master', options: ['Rate Settings', 'Rate Class Registration', 'Staff Registration', 'Scheme Registration', 'User Creation'] },
  { name: 'Entry', options: ['Scheme Cash Receipt', 'Scheme Redeem'] },
  { name: 'Records List', options: [] },
  { name: 'Inventory Reports', options: ['Scheme Report'] },
  { name: 'Accounts Reports', options: ['Receipt List'] },
  { name: 'Tools', options: [] },
  { name: 'System', options: [] },
];

const PrimaryNav = () => {
  const [userType, setuserType] = useState("");

  useEffect(() => {
    const storeduType = sessionStorage.getItem("userType");
    if (storeduType) {
      setuserType(storeduType);
    }
  }, []);

  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleToggleDropdown = (itemName) => {
    setActiveDropdown((prevItem) => (prevItem === itemName ? null : itemName));
    setSelectedOption(null); // Reset selected option when toggling dropdown
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setSelectedOption(null);
  };

  useEffect(() => {
    const closeDropdown = () => {
      setActiveDropdown(null);
      setSelectedOption(null);
    };

    document.addEventListener('click', closeDropdown);

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  const handleKeyDownNav= (e, options) => {
    if (activeDropdown) {
      let index = selectedOption !== null ? selectedOption : -1;
      if (e.key === 'ArrowDown') {
        index = (index + 1) % options.length;
        setSelectedOption(index);
      } else if (e.key === 'ArrowUp') {
        index = (index - 1 + options.length) % options.length;
        setSelectedOption(index);
      } else if (e.key === 'Enter' && index !== -1) {
        handleOptionSelectNav(options[index]);
      }
    }
  };

  const handleOptionSelectNav = (option) => {
    ////console.log(`Selected: ${option}`);
    closeDropdown();

    if (option === 'User Creation'&& userType==='ADMIN') {
      navigate('/signUp');    } 
  };

  return (
    <div className="top_navbarMain" onClick={closeDropdown} onKeyDown={(e) => handleKeyDownNav(e, navItems.find(item => item.name === activeDropdown)?.options || [])} tabIndex="0">
      {navItems.map((item) => (
        <div key={item.name} className={`primaryNavitems ${activeDropdown === item.name ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleDropdown(item.name); }}>
          {item.name}
          {item.options.length > 0 && ( // Render dropdown only if options exist
            <div className="dropdownMenu">
              {item.options.map((option, index) => (
                <div key={index} className={`dropdownItem ${selectedOption === index ? 'selected' : ''}`} onClick={(e) => { handleOptionSelectNav(option); e.stopPropagation(); }}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PrimaryNav;
