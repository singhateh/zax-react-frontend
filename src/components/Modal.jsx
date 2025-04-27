import React, { useEffect, useRef, useState } from "react";
import { FaWindowMinimize, FaWindowRestore, FaExpand, FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip"; // Corrected import for default export
import "../../styles/Modal.css";
import { useMediaQuery } from "../hooks/useMediaQuery";

const Modal = ({
    isOpen,
    onClose,
    children,
    title,
    footer,
    isLoading = false,
    isProcessing = false,
    size = "medium", // Default size
    customWidth = "500px", // Updated default custom width
    customHeight = "auto", // Custom height option
    setIsModalExpanded,
    isModalExpanded
}) => {
    const [isExpanded, setIsExpanded] = useState(true); // The modal starts in expanded state
    const [isMinimized, setIsMinimized] = useState(false); // Initial state is not minimized
    const modalRef = useRef(null); // Create a ref for the modal container
    const [processingIndex, setProcessingIndex] = useState(null);
    // const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const isMobile = useMediaQuery('(max-width: 768px)');


    // State to track if text should be hidden
    const [isTextHidden, setIsTextHidden] = useState(false);

    // Mobile responsive handling
    // useEffect(() => {
    //     const handleResize = () => {
    //         setIsMobile(window.innerWidth < 768);
    //         if (window.innerWidth < 768) {
    //             setIsExpanded(true); // Always expanded on mobile
    //         }
    //     };

    //     window.addEventListener('resize', handleResize);
    //     return () => window.removeEventListener('resize', handleResize);
    // }, []);

    // Define size classes dynamically
    const sizeClasses = {
        small: "max-w-[400px] w-full",
        medium: "max-w-[600px] w-full",
        large: "max-w-[900px] w-full",
        custom: "", // We don't need the custom class here anymore
    };

    // Check the modal's width and update the text visibility accordingly
    const checkModalWidth = (state) => {
        if (modalRef.current && footer) {
            const modalWidth = modalRef.current.offsetWidth; // Get the modal's width
            const totalButtonWidth = footer.length * 120; // 120px is an estimate for button width

            // Determine if text should be hidden based on state and modal width
            const shouldHideText =
                footer.length > 3 && (totalButtonWidth > modalWidth || state === "small");

            setIsTextHidden(shouldHideText);
        }
    };

    // Use effect to check modal size on render and when modal is resized
    useEffect(() => {
        if (isOpen) {
            checkModalWidth(isExpanded ? "large" : "small"); // Check size when modal is opened
        }
    }, [isOpen, footer, size]); // Re-check when modal opens or when footer/size changes

    useEffect(() => {
        window.addEventListener("resize", checkModalWidth); // Recheck on resize
        return () => {
            window.removeEventListener("resize", checkModalWidth); // Cleanup on unmount
        };
    }, []);

    useEffect(() => {
        if (!isExpanded) {
            checkModalWidth("small"); // Check modal width when it is minimized
        }
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded((prev) => {
            const newState = !prev;
            checkModalWidth(newState ? "large" : "small");
            return newState;
        });

        setIsModalExpanded(!isModalExpanded);
    };

    const toggleMinimize = () => {
        setIsMinimized((prev) => !prev); // Update state for minimized state
        // If the modal is minimized, check text visibility and set it accordingly
        if (isMinimized) {
            checkModalWidth("small");
        } else {
            checkModalWidth("large");
        }
    };

    if (!isOpen && !isMinimized) return null;


    const renderFooter = () => {
        if (!isLoading && Array.isArray(footer)) {
            return (
                <div className="modal-footer p-3 bg-gray-50 border-t border-gray-200">
                    <div className={`${isMobile || !isExpanded ? 'grid grid-cols-2 gap-2' : 'flex flex-row space-x-2 justify-end'}`}>

                        {footer.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setProcessingIndex(index);
                                    const result = item.onClick?.();
                                    if (result?.finally) {
                                        result.finally(() => setProcessingIndex(null));
                                    } else {
                                        setTimeout(() => setProcessingIndex(null), 1000);
                                    }
                                }}
                                disabled={processingIndex !== null}
                                className={`
                      px-4 py-2 rounded-md text-white flex items-center justify-center 
                      transition-colors min-w-[120px]
                      ${item.color === "green"
                                        ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                                        : item.color === "red"
                                            ? "bg-red-500 hover:bg-red-600 active:bg-red-700"
                                            : item.color === "blue"
                                                ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
                                                : "bg-gray-500 hover:bg-gray-600 active:bg-gray-700"
                                    }
                      ${processingIndex === index ? 'opacity-75' : ''}
                    `}
                                data-tip={item.label}
                            >
                                {item.icon && (
                                    <span className={isMobile ? 'mr-2' : ''}>
                                        {item.icon}
                                    </span>
                                )}

                                <span className="truncate">
                                    {item.label}
                                </span>

                                {processingIndex === index && (
                                    <svg
                                        className="animate-spin ml-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Improved Auto-Detection Function
    const detectContentType = (children) => {
        if (!children) return "unknown";

        const childArray = React.Children.toArray(children);

        // Check if there's a <table> present in the direct children
        if (childArray.some(child => child?.type === "table")) {
            return "table";
        }

        // Check if there's a div with "card" in its className
        if (childArray.some(child => child?.type === "div" && child.props.className?.includes("card"))) {
            return "cards";
        }

        return "unknown";
    };

    const contentType = detectContentType(children);


    // Loading Placeholder - Table or Cards
    const renderLoading = (contentType) => {
        return (
            <div className="w-full min-h-[650px] max-h-[600px] flex flex-col justify-center items-center">
                {contentType === "table" ? (
                    // Table Skeleton Loader
                    <div className="w-full">
                        <div className="grid grid-cols-5 gap-4 p-3 bg-gray-200 animate-pulse rounded-md">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-8 bg-gray-300 rounded"></div>
                            ))}
                        </div>
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="grid grid-cols-4 gap-4 p-3 border-b bg-gray-100 animate-pulse">
                                {[...Array(4)].map((_, j) => (
                                    <div key={j} className="h-8 bg-gray-300 rounded"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Cards Skeleton Loader
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-6 bg-gray-100 animate-pulse rounded-lg shadow">
                                <div className="h-32 bg-gray-300 rounded"></div>
                                <div className="h-6 bg-gray-400 rounded mt-4"></div>
                                <div className="h-4 bg-gray-300 rounded mt-2"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };


    return (
        <>
            {/* Modal Overlay (Only visible if not minimized) */}
            {!isMinimized && (
                <div className="modal-overlay">
                    <div
                        ref={modalRef} // Attach ref to modal container
                        className={`modal-container ${isMinimized ? "hidden" : "visible"} ${sizeClasses[size]}`}
                        style={{
                            width: isExpanded ? (size === "custom" ? customWidth : "90vw") : "500px", // Default width updated here
                            height: isExpanded ? (size === "custom" ? customHeight : "90vh") : "auto",
                            maxWidth: isExpanded ? "none" : undefined,
                            maxHeight: isExpanded ? "none" : undefined,
                        }}

                    // style={{
                    //     maxHeight: isMobile ? '100%' : isExpanded ? '90vh' : 'auto',
                    //     width: isMobile ? '100%' : isExpanded ? '90vw' : customWidth,
                    // }}
                    >
                        {/* Modal Header */}
                        <div className="modal-header">
                            <div className="modal-title" title={title || "Default Title"}>
                                {title || "Default Title"}
                            </div>

                            <div className="modal-actions">
                                {isMobile ? (
                                    <button onClick={onClose} className="btn-close">
                                        <FaTimes />
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={toggleMinimize} className="btn-minimize">
                                            {isMinimized ? <FaExpand /> : <FaWindowMinimize />}
                                        </button>
                                        <button onClick={toggleExpand} className="btn-expand">
                                            {isExpanded ? <FaWindowRestore /> : <FaExpand />}
                                        </button>
                                        <button onClick={onClose} className="btn-close">
                                            <FaTimes />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Modal Body (Visible only if not minimized) */}
                        {!isMinimized && (
                            <div className={`modal-body flex-1 overflow-auto p-0 ${isMobile ? "h-[67vh]" : ""}`}>
                                {isLoading ? renderLoading(contentType) : children}
                            </div>
                        )}

                        {/* Modal Footer */}
                        {renderFooter()}
                    </div>
                </div>
            )}

            {isMinimized && (
                <div
                    className="modal-minimized"
                    onClick={() => setIsMinimized(false)}
                >
                    <div className="modal-title" style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {title || "Default Title"} {/* Display dynamic title */}
                    </div>
                    <div className="modal-actions" style={{ display: "flex", justifyContent: "space-between" }}>
                        <button onClick={toggleMinimize} className="btn-maximize">
                            <FaExpand />
                        </button>
                        <button onClick={onClose} className="btn-close">
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}

            {/* Tooltip globally rendered */}
            <Tooltip place="top" effect="solid" />
        </>
    );
};

export default Modal;
