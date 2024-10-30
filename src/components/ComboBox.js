import React, { useState, useEffect, useRef } from 'react';

import { IoIosArrowDown } from "react-icons/io";

const ComboBox = ({
    options,
    findedValue,
    placeholder,
    onSelect,
    onInputChange,
    className,
    inputClassName,
    onKeyDown,
    comboRef,
    onClick,
    onBlur,
    onFocus,
    inlineStyles,
    inputType = "text",
    readOnly = false,
    disabled = false

}) => {
    const [inputValue, setInputValue] = useState(findedValue || '');
    const [isOpen, setIsOpen] = useState(false);

    const [filteredOptions, setFilteredOptions] = useState(options); // New state

    const clearInput = () => {
        setInputValue('');
    };
    // Expose clearInput function through comboRef reference
    useEffect(() => {
        if (comboRef.current) {
            comboRef.current.clearInput = clearInput;
        }
    }, [comboRef]);
    useEffect(() => {
        setInputValue(findedValue || ''); // Update input value when findedValue prop changes
    }, [findedValue]);

    useEffect(() => {
        setFilteredOptions(options);
    }, [options]); // Update options when the prop changes

    const handleInputChange = (event) => {
        const value = event.target.value;

        setInputValue(value);

        // Filter options based on the entered value
        const filtered = options.filter((option) =>
            option.some((optValue) => optValue && optValue.toString().toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredOptions(filtered);
        // Call the onInputChange prop with the new input value
        onInputChange && onInputChange(value);

        // Always open the dropdown when there is input
        setIsOpen(value !== '');


    };




    const handleSelectOption = (option) => {
        setInputValue(option[1].toString());
        setIsOpen(false);
        onSelect && onSelect(option);
        onInputChange && onInputChange(option);
    };


    // const handleKeyDown = (event) => {
    //     if (isOpen) {
    //         switch (event.key) {
    //             case 'ArrowDown': {
    //                 event.preventDefault(); // Prevent the default scrolling behavior
    //                 const currentIndex = filteredOptions.findIndex(option => option === inputValue);
    //                 const nextIndex = (currentIndex + 1) % filteredOptions.length;
    //                 const nextOption = filteredOptions[nextIndex];
    //                 if (nextOption) {
    //                     setInputValue(nextOption);
    //                     // Scroll the dropdown after the 5th option
    //                     if (nextIndex >= 0) {
    //                         const dropdownContainer = document.querySelector('.combobox_dropdown');
    //                         const optionElement = document.querySelector(`.dropdown_option:nth-child(${nextIndex + 1})`);
    //                         if (dropdownContainer && optionElement) {
    //                             dropdownContainer.scrollTop = optionElement.offsetTop;
    //                         }
    //                     }
    //                 }
    //                 break;
    //             }
    //             case 'ArrowUp': {
    //                 event.preventDefault(); // Prevent the default scrolling behavior
    //                 const currentIndex = filteredOptions.findIndex(option => option === inputValue);
    //                 const prevIndex = (currentIndex - 1 + filteredOptions.length) % filteredOptions.length;
    //                 const prevOption = filteredOptions[prevIndex];
    //                 if (prevOption) {
    //                     setInputValue(prevOption);
    //                     // Scroll the dropdown to ensure the previous option is visible
    //                     const dropdownContainer = document.querySelector('.combobox_dropdown');
    //                     const optionElement = document.querySelector(`.dropdown_option:nth-child(${prevIndex + 1})`);
    //                     if (dropdownContainer && optionElement) {
    //                         dropdownContainer.scrollTop = optionElement.offsetTop;
    //                     }
    //                 }
    //                 break;
    //             }

    //             case 'Enter':

    //                 setIsOpen(false);

    //                 break;
    //             case 'Escape':
    //                 setIsOpen(false);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    //     // Pass the event to the parent component
    //     onKeyDown && onKeyDown(event);
    // };
    const handleKeyDown = (event) => {
        if (isOpen) {
            switch (event.key) {
                case 'ArrowDown': {
                    event.preventDefault(); // Prevent the default scrolling behavior
                    const currentIndex = filteredOptions.findIndex(option => option[1].toString() === inputValue);
                    const nextIndex = (currentIndex + 1) % filteredOptions.length;
                    const nextOption = filteredOptions[nextIndex];
                    if (nextOption) {
                        setInputValue(nextOption[1].toString());
                        // Scroll the dropdown after the 5th option
                        if (nextIndex >= 0) {
                            const dropdownContainer = document.querySelector('.combobox_dropdown');
                            const optionElement = document.querySelector(`.dropdown_option:nth-child(${nextIndex + 1})`);
                            if (dropdownContainer && optionElement) {
                                dropdownContainer.scrollTop = optionElement.offsetTop;
                            }
                        }
                    }
                    break;
                }
                case 'ArrowUp': {
                    event.preventDefault(); // Prevent the default scrolling behavior
                    const currentIndex = filteredOptions.findIndex(option => option[1].toString() === inputValue);
                    const prevIndex = (currentIndex - 1 + filteredOptions.length) % filteredOptions.length;
                    const prevOption = filteredOptions[prevIndex];
                    if (prevOption) {
                        setInputValue(prevOption[1].toString());
                        // Scroll the dropdown to ensure the previous option is visible
                        const dropdownContainer = document.querySelector('.combobox_dropdown');
                        const optionElement = document.querySelector(`.dropdown_option:nth-child(${prevIndex + 1})`);
                        if (dropdownContainer && optionElement) {
                            dropdownContainer.scrollTop = optionElement.offsetTop;
                        }
                    }
                    break;
                }
                case 'Enter': {
                    event.preventDefault(); // Prevent form submission
                    const selectedOption = filteredOptions.find(option => option[1].toString() === inputValue);
                    if (selectedOption) {
                        handleSelectOption(selectedOption);
                    }
                    setIsOpen(false);
                    break;
                }
                case 'Escape':
                    setIsOpen(false);
                    break;
                default:
                    break;
            }
        }
        // Pass the event to the parent component
        onKeyDown && onKeyDown(event);
    };


    // useEffect(() => {
    //     // Focus on the input field when the component mounts or findedValue changes111111
    //     comboRef.current.focus();

    // }, [findedValue]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const inputElement = comboRef.current;

            if (isOpen && inputElement && !inputElement.contains(event.target)) {
                setIsOpen(false);
            }
        };


        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen]);
    // Add a state to track whether the dropdown is open or closed
    const [isArrowRotated, setIsArrowRotated] = useState(false);
    /////styles////
    const styles = {
        dropdown_option: {
            padding: '8px',
            cursor: 'pointer',
            fontWeight: '350',
            fontSize: '11px',
            fontFamily: '"Nunito Sans", sans-serif,Roboto, Arial, Helvetica',

        },
        selectedcomboopt: {
            backgroundColor: '#007BFF',
            color: 'white',
        },
        'dropdown_option:hover': {
            backgroundColor: '#f0f0f0',
        },

        combo_box_input: {

        },
        'combo_box_input_field': {
            // padding: '8px',
            cursor: 'pointer',

        },
        // 'arrow_icon': {
        //     position: 'absolute',
        //     top: '50%',
        //     right: '10px',
        //     transform: 'translateY(-50%)',
        //     cursor: 'pointer',
        // },
        combo_box_container: {
            position: 'relative',
           
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

        },

        combo_box_input: {
            position: 'relative',
            width: "100%",
            height: "100%"
        },
        'combo_box_input_field': {
            padding: '0',
            marginLeft: '0',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            borderWidth: 1,
            fontFamily: '"Nunito Sans", sans-serif,Roboto, Arial, Helvetica', // Use Google Font
            

        },
        'arrow_icon.rotated': {
            transform: 'translateY(-50%) rotate(180deg)',
        },

        combobox_dropdown: {
            width: '100%',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            maxHeight: '150px',
            overflowY: 'auto',
            backgroundColor: 'white',
            position: 'relative',
            zIndex: '1000',
        },

    };

    /////////////
    const handleBlur = (event) => {
        setTimeout(() => {
            setIsOpen(false);
        }, 100); // Adjust the delay as needed



        onBlur && onBlur(event);
    };

    const handleFocus = () => {
        if (readOnly || disabled) return;
        setIsOpen(true);
        onFocus && onFocus()
    };



    return (
        <div className={`combo_box_container ${className}`} style={styles.combo_box_container}>
            <div className="combo_box_input" style={styles.combo_box_input}>
                <input
                    ref={comboRef}
                    type={inputType}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={`combo_box_input_field ${inputClassName}`}
                    style={{ ...styles.combo_box_input_field, ...inlineStyles }}
                    onBlur={(e)=>handleBlur(e)}
                    onFocus={handleFocus}
                    onClick={onClick}
                    readOnly={readOnly}
                    disabled={disabled}


                />

                {/* <div className={`arrow-icon ${isOpen ? 'rotated' : ''}`} onClick={handleToggleDropdown}>
                    &#9660;
                </div> */}
                {/* <div style={styles.arrow_icon} className={`arrow_icon ${isOpen ? 'rotated' : ''}`} >
                    <IoIosArrowDown />
                </div> */}


                {isOpen && (
                    <div style={styles.combobox_dropdown} className="combobox_dropdown">
                        {filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                // style={styles.dropdown_option}
                                style={{ ...styles.dropdown_option, ...(option[1].toString() === inputValue ? styles.selectedcomboopt : {}) }}
                                className={`dropdown_option ${option[1].toString() === inputValue ? 'selectedcomboopt' : ''}`}
                                onMouseDown={(e) => {
                                    e.stopPropagation(); // Stop the event propagation to prevent the dropdown from closing
                                    handleSelectOption(option);
                                }}


                            >
                                {option[1]}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ComboBox;