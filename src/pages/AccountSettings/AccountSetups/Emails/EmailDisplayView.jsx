import { FiEdit } from "react-icons/fi";
import Button from "../../../../components/Button";
import EmailForm from "./EmailForm";
import { useState } from "react";

export const EmailDisplayView = ({ doctor, onUpdate }) => {
    const emailDetail = doctor?.emailDetail || {};
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    return (
        <div >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Email Settings</h2>
                <Button
                    onClick={() => setIsEditModalOpen(true)}
                    variant="outline"
                    size="sm"
                    icon={<FiEdit className="mr-1" />}
                >
                    Edit Settings
                </Button>
            </div>

            <div className="space-y-4">
                <div className="border-b pb-4">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Email Preferences</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500 w-48">Use registered email:</span>
                            <span className="font-medium">
                                {emailDetail.can_copy_registration_email ? 'Yes' : 'No'}
                            </span>
                        </div>

                        {!emailDetail.can_copy_registration_email && (
                            <>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 w-48">Appointments:</span>
                                    <span className="font-medium">
                                        {emailDetail.appointment_email || 'Not set'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 w-48">DNA Notifications:</span>
                                    <span className="font-medium">
                                        {emailDetail.dna_email || 'Not set'}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-500 w-48">Reports:</span>
                                    <span className="font-medium">
                                        {emailDetail.report_email || 'Not set'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {emailDetail.disclaimer && (
                    <div>
                        <h3 className="text-md font-medium text-gray-700 mb-2">Disclaimer</h3>
                        <div
                            className="bg-gray-50 p-4 rounded text-sm text-gray-600"
                            dangerouslySetInnerHTML={{ __html: emailDetail.disclaimer }}
                        />
                    </div>
                )}

            </div>

            {/* Edit Modal */}
            <EmailForm
                doctor={doctor}
                onUpdate={onUpdate}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
}
