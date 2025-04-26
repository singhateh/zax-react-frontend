import React, { useState } from 'react';
import Button from '../../../../components/Button';
import SelectField from '../../../../components/SelectField';
import Table from '../../../../components/Table';
import { getQualificationOptions } from '../../../../utilities/constant';

export default function Specialty({ doctor, onUpdate }) {
    const [formData, setFormData] = useState({
        primary: '',
        secondary: '',
        expertise: ''
    });
    const [specialties, setSpecialties] = useState(doctor?.user_specialties || []);

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || null);

        const newFormData = {
            ...formData,
            [field]: selectedValue,
        };

        setFormData(newFormData);
    };

    const handleAddSpecialty = () => {
        if (!formData.primary) return;

        const newSpecialty = {
            id: Date.now(), // temporary ID
            primary: formData.primary,
            secondary: formData.secondary,
            expertise: formData.expertise,
            created_at: new Date().toISOString()
        };

        const updatedSpecialties = [...specialties, newSpecialty];
        setSpecialties(updatedSpecialties);
        setFormData({ primary: '', secondary: '', expertise: '' });

        if (onUpdate) onUpdate(updatedSpecialties);
    };

    const handleRemove = (id) => {
        if (!window.confirm('Are you sure you want to remove this specialty?')) return;

        const updatedSpecialties = specialties.filter(spec => spec.id !== id);
        setSpecialties(updatedSpecialties);
        if (onUpdate) onUpdate(updatedSpecialties);
    };

    const columns = [
        {
            header: 'Primary Specialty',
            accessor: 'primary',
            cell: (row) => (
                <span className="font-medium text-gray-900">{row.primary}</span>
            )
        },
        {
            header: 'Secondary Specialty',
            accessor: 'secondary',
            cell: (row) => row.secondary || '-'
        },
        {
            header: 'Expertise',
            accessor: 'expertise',
            cell: (row) => row.expertise || '-'
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <Button
                    onClick={() => handleRemove(row.id)}
                    variant="danger"
                    size="sm"
                    icon={<i className="fa fa-trash" />}
                    className="mr-2"
                >
                    Remove
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <SelectField
                    label="Primary Specialty"
                    name="primary"
                    value={formData.primary}
                    onChange={handleSelectChange('primary')}
                    options={getQualificationOptions}
                    isRequired
                />

                <SelectField
                    label="Secondary Specialty"
                    name="secondary"
                    value={formData.secondary}
                    onChange={handleSelectChange('secondary')}
                    options={getQualificationOptions}
                />

                <SelectField
                    label="Expertise"
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleSelectChange('expertise')}
                    options={getQualificationOptions}
                />
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleAddSpecialty}
                    disabled={!formData.primary}
                    variant="primary"
                    icon={<i className="fa fa-plus" />}
                >
                    Add Specialty
                </Button>
            </div>

            {specialties.length > 0 ? (
                <Table
                    columns={columns}
                    data={specialties}
                    emptyMessage="No specialties added yet"
                    className="mt-4"
                />
            ) : (
                <div className="text-center py-4 text-gray-500">
                    No specialties have been added yet
                </div>
            )}
        </div>
    );
}