import React from "react";
import Select from "react-select";
import Skeleton from "../../components/Skeleton";
import CollapsibleSection from "../../components/CollapsibleSection";

const SpecialInstructionDetails = ({ loading }) => {
    return (
        <CollapsibleSection title="Special Instructions">
            {loading ? (
                <Skeleton type="rect" count={3} height="30px" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div>
                        <label className="text-sm font-medium block mb-1">Special Instructions</label>
                        <Select
                            placeholder="Special Instructions"
                        />
                    </div>
                </div>
            )}
        </CollapsibleSection>
    );
};

export default SpecialInstructionDetails;
