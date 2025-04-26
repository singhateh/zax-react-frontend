import { ToggleSection } from './ToggleSection';
import { EditableTable } from './EditableTable';
import { PlusSquare } from 'lucide-react';

export const VenueBasedPricing = ({
    enabled,
    onToggle,
    venueRates,
    handleVenueChange,
    onAddVenueRate,
    onRemoveVenueRate,
    venueOptions,
    labelText = 'Add More Venues'
}) => {
    const reportColumns = [
        {
            key: 'venue_id', label: 'Venues', type: 'select',
            options: venueOptions
        },
        { key: 'report_with_record', label: 'Report with records', type: 'number' },
        { key: 'report_without_record', label: 'Report without records', type: 'number' },
        { key: 'addendum_report_venue', label: 'Addendum Report', type: 'number' },
        { key: 'dna_venue', label: 'DNA', type: 'number' },
        { key: 'addendum_letter_venue', label: 'Addendum Letter', type: 'number' }
    ];

    return (
        <ToggleSection
            title="VENUE BASED PRICE"
            enabled={enabled}
            onToggle={onToggle}
            toggleLabel="Set Venue based Payment Terms"
        >
            <EditableTable
                columns={reportColumns}
                data={Object.values(venueRates)}
                onAdd={onAddVenueRate}
                onRemove={onRemoveVenueRate}
                onCellChange={handleVenueChange}
                addButtonLabel={<div className='flex gap-2 cursor-pointer'><PlusSquare /> {labelText}</div>}
            />
        </ToggleSection>
    );
};

