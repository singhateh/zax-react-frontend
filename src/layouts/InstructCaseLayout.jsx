import {
    FileText,
    ChevronLeft,
    Edit,
    Plus,
    FilePlus,
    Eye,
    CalendarPlus,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function InstructCaseLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const getTitleFromPath = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        // Handle /instruct-cases/[resource]/[action]/[id] pattern
        if (pathSegments.length >= 3 && pathSegments[0] === 'instruct-cases') {
            const resource = pathSegments[1];
            const action = pathSegments[2] || 'view'; // Default to 'view' if no action

            const resourceNames = {
                'claimant': 'Claimant',
                'agency': 'Agency',
                'report': 'Report',
                'medical': 'Medical Record',
                'case': 'Case',
                // Add more as needed
            };

            const actionNames = {
                'edit': 'Edit Case',
                '': 'Add Case',
                'create': 'Create',
                'view': 'View',
                'book': 'Book and Instruct',
                // Add more as needed
            };

            const friendlyResource = resourceNames[resource] ||
                resource.charAt(0).toUpperCase() + resource.slice(1);
            const friendlyAction = actionNames[action] ||
                action.charAt(0).toUpperCase() + action.slice(1);

            return `${friendlyResource} ${friendlyAction}`;
        }

        // Handle other special cases
        if (location.pathname.toLowerCase().endsWith('/new')) {
            return 'Add New Case';
        }

        // Default route detection
        const path = location.pathname.toLowerCase();
        if (path.includes('/agency')) return 'Agency Details';
        if (path.includes('/solicitor')) return 'Solicitor Details';
        // ... other existing cases

        return 'Add Case';
    };

    // Corresponding icon getter
    const getIconFromPath = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);

        if (pathSegments.length >= 3 && pathSegments[0] === 'instruct-cases') {
            const action = pathSegments[2];

            const actionIcons = {
                'edit': <Edit className="w-5 h-5 mr-2" />,
                'add': <Plus className="w-5 h-5 mr-2" />,
                'create': <FilePlus className="w-5 h-5 mr-2" />,
                'view': <Eye className="w-5 h-5 mr-2" />,
                'book': <CalendarPlus className="w-5 h-5 mr-2" />,
                // Default icon if no match
                'default': <FileText className="w-5 h-5 mr-2" />
            };

            return actionIcons[action] || actionIcons.default;
        }

        // ... rest of your icon logic
    };

    return (

        <div className="inventory-layout">
            {/* Header/Navbar */}
            <div className="bg-blue-600 sticky flex top-0 left-0 right-0
                 flex-row text-white w-full
                  px-4 justify-between items-center z-50 transition-all duration-300 
                 h-12 shadow-md">

                <div className="flex items-center">
                    {getIconFromPath()}
                    <h2 className="title text-xl font-semibold text-white truncate max-w-[100%]">
                        {getTitleFromPath()}
                    </h2>
                </div>
                <button
                    className="back-button flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>

            </div>

            {/* Content Area */}
            <div className="inventory-content">
                <Outlet />
            </div>
        </div>
    );
}

export default InstructCaseLayout;