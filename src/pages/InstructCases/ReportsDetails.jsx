import React from "react";
import SelectField from "../../components/SelectField";
import { ClipboardList } from "lucide-react";
import CollapsibleSection from "../../components/CollapsibleSection";
import Skeleton from "../../components/Skeleton";
import NotesAndInjuriesSection from "./NotesAndInjuriesSection";

const ReportsDetails = ({ loading, formData, setFormData, handleSelectChange, reportTypesOptions, recommendedReportingTool }) => {
    return (
        <CollapsibleSection title="Reports Details" icon={<ClipboardList />}>
            {loading ? (
                <Skeleton type="rect" count={1} height="30px" />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
                    {/* Report Type Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Report Type</label>
                        <SelectField
                            placeholder="Report Type"
                            name="report_type_id"
                            value={formData.report_type_id}
                            onChange={handleSelectChange("report_type_id")}
                            options={reportTypesOptions}
                            className="w-full"  // Ensure select field takes full width
                        />
                    </div>

                    {/* Recommended Reporting Tool */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 block">Recommended Reporting Tool</label>
                        <SelectField
                            name="recommended_reporting_tool"
                            value={formData.recommended_reporting_tool}
                            onChange={handleSelectChange("recommended_reporting_tool")}
                            options={recommendedReportingTool}
                            className="w-full"
                        />
                    </div>

                    {/* Notes and Injuries Section - takes full width on mobile, then normal column on lg+ */}
                    <div className="lg:col-span-1">
                        <NotesAndInjuriesSection
                            formData={formData}
                            onFormDataChange={(updatedData) => setFormData(updatedData)}
                        />
                    </div>
                </div>
            )}
        </CollapsibleSection>
    );
};

export default ReportsDetails;
