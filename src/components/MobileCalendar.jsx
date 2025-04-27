import { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ChevronLeft, ChevronRight, Circle, RefreshCw, AlertCircle } from 'lucide-react';

// Set up localizer
const localizer = momentLocalizer(moment);

const MobileCalendar = ({ events, loading, error, fetchAppointments, setModalTitle }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [isAnimating, setIsAnimating] = useState(false);

    // Smooth month transition
    const handleNavigate = useCallback((newDate) => {
        setIsAnimating(true);
        setCurrentDate(newDate);
        setTimeout(() => setIsAnimating(false), 300);
    }, []);

    // Custom toolbar with animation
    const CustomToolbar = ({ onNavigate }) => (
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <button
                onClick={() => onNavigate('PREV')}
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95"
                aria-label="Previous month"
            >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className={`text-lg font-semibold text-gray-800 transition-opacity ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
                {moment(currentDate).format('MMMM YYYY')}
            </h2>

            <button
                onClick={() => onNavigate('NEXT')}
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors active:scale-95"
                aria-label="Next month"
            >
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );

    // Custom day cell with better styling
    const CustomDateHeader = ({ date }) => {
        const isToday = moment(date).isSame(new Date(), 'day');
        const hasEvents = events.some(e => moment(e.start).isSame(date, 'day'));

        return (
            <div className="flex flex-col items-center justify-start h-full pt-1">
                <span className={`
          text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
          ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
          transition-colors
        `}>
                    {date.getDate()}
                </span>
                {hasEvents && (
                    <div className="flex mt-1 space-x-[2px]">
                        {[1, 2, 3].slice(0, Math.min(3, events.filter(e => moment(e.start).isSame(date, 'day')).length)).map((_, i) => (
                            <span key={i} className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Custom week header
    const CustomWeekHeader = ({ date }) => (
        <div className="text-xs font-medium text-gray-500 py-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()].charAt(0)}
        </div>
    );

    return (
        <div className="overflow-hidden mt-25">
            {error ? (
                <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-red-500 font-medium mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="w-full relative">
                    {loading && (
                        <div className="absolute inset-0 z-50 bg-gray-100 bg-opacity-90 flex items-center justify-center">
                            <div className="w-full p-4 space-y-4 animate-pulse">
                                {/* Skeleton Header */}
                                <div className="flex justify-between items-center p-3">
                                    <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
                                    <div className="h-7 w-40 bg-gray-200 rounded-md"></div>
                                    <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
                                </div>

                                {/* Skeleton Weekdays */}
                                <div className="grid grid-cols-7 gap-2 px-1">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                        <div key={i} className="h-8 flex items-center justify-center">
                                            <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Skeleton Days */}
                                <div className="grid grid-cols-7 gap-1">
                                    {[...Array(35)].map((_, i) => (
                                        <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Calendar Component */}
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        date={currentDate}
                        onNavigate={handleNavigate}
                        view={view}
                        onView={(view) => setView(view)}
                        views={['month', 'agenda']}
                        components={{
                            toolbar: CustomToolbar,
                            month: {
                                dateHeader: CustomDateHeader,
                                header: CustomWeekHeader,
                            },
                        }}
                        selectable
                        onSelectEvent={(event) => {
                            fetchAppointments(event.id);
                            setModalTitle(`Appointments for ${event.title} on ${moment(event.start).format('MMM D, YYYY')}`);
                        }}
                        onSelectSlot={(slotInfo) => {
                            console.log('Selected slot:', slotInfo);
                        }}
                        style={{
                            height: 'calc(100vh - 160px)',
                            paddingBottom: '80px',
                        }}
                        eventPropGetter={(event) => ({
                            style: {
                                backgroundColor: '#3b82f6',
                                borderRadius: '6px',
                                color: 'white',
                                border: 'none',
                                fontSize: '12px',
                                padding: '2px 6px',
                                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                            },
                        })}
                    />
                </div>
            )}
        </div>
    );
};

export default MobileCalendar;