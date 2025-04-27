import Modal from '../../../components/Modal';
import { X, AlertCircle, Clock, CheckCircle, Pause, User, Mail, Phone, Calendar, AlertTriangle } from 'lucide-react';

const AlertDetails = ({ alert, isDetailOpen, setIsDetailOpen }) => {
    const handleCloseModal = () => {
        setIsDetailOpen(false);
    };

    if (!alert) {
        return null;
    }

    const getStatusColor = (status) => {
        const statusMap = {
            'active': { bg: 'bg-emerald-50', text: 'text-emerald-800', icon: <CheckCircle className="w-4 h-4" /> },
            'pending': { bg: 'bg-amber-50', text: 'text-amber-800', icon: <Clock className="w-4 h-4" /> },
            'hold': { bg: 'bg-orange-50', text: 'text-orange-800', icon: <Pause className="w-4 h-4" /> },
            'inactive': { bg: 'bg-rose-50', text: 'text-rose-800', icon: <AlertCircle className="w-4 h-4" /> },
            'default': { bg: 'bg-gray-50', text: 'text-gray-800', icon: <AlertTriangle className="w-4 h-4" /> }
        };

        const statusKey = status?.toLowerCase() || 'default';
        return statusMap[statusKey] || statusMap.default;
    };

    const statusInfo = getStatusColor(alert.priority);

    return (
        <Modal
            isOpen={isDetailOpen}
            onClose={handleCloseModal}
            size="custom"
            customWidth="600px"
        >
            <div className="relative">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {alert.tabName || 'Alert Details'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            Created: {new Date(alert.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`${statusInfo.bg} ${statusInfo.text} inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium mb-6`}>
                    {statusInfo.icon}
                    <span className="ml-1.5">{alert.priority || 'No status'}</span>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Message Section */}
                    <div className="md:col-span-2">
                        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-500" />
                                Message
                            </h3>
                            <div
                                className="prose prose-sm max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: alert.message || '<p>No message provided</p>' }}
                            />
                        </div>
                    </div>

                    {/* Claimant Section */}
                    {alert.claimant && (
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-500" />
                                Claimant Details
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium text-gray-700">Name</p>
                                    <p className="text-gray-900">{alert.claimant.name || 'N/A'}</p>
                                </div>

                                {alert.claimant.mobile && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">{alert.claimant.mobile}</span>
                                    </div>
                                )}

                                {alert.claimant.dob && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">DOB: {alert.claimant.dob}</span>
                                    </div>
                                )}

                                {alert.claimant.dna_email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">DNA: {alert.claimant.dna_email}</span>
                                    </div>
                                )}

                                {alert.claimant.report_email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-700">Reports: {alert.claimant.report_email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Additional Details Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-purple-500" />
                            Alert Metadata
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="font-medium text-gray-700">Color Code</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div
                                        className="w-5 h-5 rounded-full border border-gray-200"
                                        style={{ backgroundColor: alert.color || '#e5e7eb' }}
                                    />
                                    <span className="text-gray-700">{alert.color || 'Default'}</span>
                                </div>
                            </div>

                            <div>
                                <p className="font-medium text-gray-700">Created At</p>
                                <p className="text-gray-700">{new Date(alert.created_at).toLocaleString()}</p>
                            </div>

                            {alert.updated_at && (
                                <div>
                                    <p className="font-medium text-gray-700">Last Updated</p>
                                    <p className="text-gray-700">{new Date(alert.updated_at).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AlertDetails;