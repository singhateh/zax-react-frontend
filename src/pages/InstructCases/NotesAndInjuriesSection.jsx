import { useState } from 'react';
import { NotebookPen, MapPin, Plus, X, ChevronDown } from 'lucide-react';

const NotesAndInjuriesSection = ({ formData, onFormDataChange }) => {
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'injuries'
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [showAllInjuries, setShowAllInjuries] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newInjury, setNewInjury] = useState('');

    // Get notes and injuries from formData or initialize as empty arrays
    const notes = formData?.notes || [];
    const injuries = formData?.injuries || [];

    const updateFormData = (field, value) => {
        onFormDataChange({
            ...formData,
            [field]: value
        });
    };

    const addNote = () => {
        if (newNote.trim()) {
            const updatedNotes = [...notes, { id: Date.now(), text: newNote }];
            updateFormData('notes', updatedNotes);
            setNewNote('');
        }
    };

    const addInjury = () => {
        if (newInjury.trim()) {
            const updatedInjuries = [...injuries, { id: Date.now(), text: newInjury }];
            updateFormData('injuries', updatedInjuries);
            setNewInjury('');
        }
    };

    const removeItem = (type, id) => {
        if (type === 'note') {
            const updatedNotes = notes.filter(note => note.id !== id);
            updateFormData('notes', updatedNotes);
        } else {
            const updatedInjuries = injuries.filter(injury => injury.id !== id);
            updateFormData('injuries', updatedInjuries);
        }
    };

    return (
        <div className="bg-white rounded-lg  border border-gray-200 p-4">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
                <button
                    className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('notes')}
                >
                    <NotebookPen className="w-4 h-4" />
                    <span>Notes ({notes.length})</span>
                </button>
                <button
                    className={`flex items-center gap-2 px-4 py-2 ${activeTab === 'injuries' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('injuries')}
                >
                    <MapPin className="w-4 h-4" />
                    <span>Injuries ({injuries.length})</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[100px]">
                {activeTab === 'notes' ? (
                    <div>
                        {/* Add Note Form */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a new note..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                            />
                            <button
                                onClick={addNote}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-2 relative">
                            {notes.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No notes added yet</p>
                            ) : (
                                <>
                                    {/* First note always visible */}
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                        <span className="text-sm">{notes[0].text}</span>
                                        <button
                                            onClick={() => removeItem('note', notes[0].id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Show more notes dropdown */}
                                    {notes.length > 1 && (
                                        <div
                                            className="group relative inline-block"
                                            onMouseEnter={() => setShowAllNotes(true)}
                                            onMouseLeave={() => setShowAllNotes(false)}
                                        >
                                            <button className="flex items-center text-blue-600 text-sm mt-2">
                                                <ChevronDown className="w-4 h-4 mr-1" />
                                                {notes.length - 1} more note{notes.length > 2 ? 's' : ''}
                                            </button>

                                            {showAllNotes && (
                                                <div className="absolute z-10 left-0 mt-1 w-64 bg-white shadow-lg rounded-md border border-gray-200 p-2">
                                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                                        {notes.slice(1).map(note => (
                                                            <div key={note.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                                <span className="text-sm">{note.text}</span>
                                                                <button
                                                                    onClick={() => removeItem('note', note.id)}
                                                                    className="text-gray-400 hover:text-red-500"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Add Injury Form */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newInjury}
                                onChange={(e) => setNewInjury(e.target.value)}
                                placeholder="Add a new injury..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                onKeyDown={(e) => e.key === 'Enter' && addInjury()}
                            />
                            <button
                                onClick={addInjury}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add</span>
                            </button>
                        </div>

                        {/* Injuries List */}
                        <div className="space-y-2 relative">
                            {injuries.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No injuries added yet</p>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                        <span className="text-sm">{injuries[0].text}</span>
                                        <button
                                            onClick={() => removeItem('injury', injuries[0].id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {injuries.length > 1 && (
                                        <div
                                            className="group relative inline-block"
                                            onMouseEnter={() => setShowAllInjuries(true)}
                                            onMouseLeave={() => setShowAllInjuries(false)}
                                        >
                                            <button className="flex items-center text-blue-600 text-sm mt-2">
                                                <ChevronDown className="w-4 h-4 mr-1" />
                                                {injuries.length - 1} more injur{injuries.length > 2 ? 'ies' : 'y'}
                                            </button>

                                            {showAllInjuries && (
                                                <div className="absolute z-10 left-0 mt-1 w-64 bg-white shadow-lg rounded-md border border-gray-200 p-2">
                                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                                        {injuries.slice(1).map(injury => (
                                                            <div key={injury.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                                <span className="text-sm">{injury.text}</span>
                                                                <button
                                                                    onClick={() => removeItem('injury', injury.id)}
                                                                    className="text-gray-400 hover:text-red-500"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesAndInjuriesSection;