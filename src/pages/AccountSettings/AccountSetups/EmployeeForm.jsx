import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { FaTrashAlt } from 'react-icons/fa';
import { EditIcon } from 'lucide-react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import InputField from '../../../components/InputField';
import SelectField from '../../../components/SelectField';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import Table from '../../../components/Table';
import { paginate } from '../../../utilities/paginate';
import { getTitle } from '../../../utilities/constant';

const EmployeeForm = ({ doctor, onUpdate }) => {
    const [employees, setEmployees] = useState(doctor.employees || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const { currentItems, totalPages } = paginate(employees, currentPage, itemsPerPage);

    const [formData, setFormData] = useState({
        title: '',
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        mobile: '',
        status: 'active'
    });

    const roles = (doctor.roles || []).map(role => ({
        label: role.name,
        value: role.id
    }));

    const statusOptions = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    useEffect(() => {
        if (doctor?.employees) {
            setEmployees(doctor.employees);
        }
    }, [doctor]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (field) => (input) => {
        const selectedValue = input?.value ?? (input?.target?.value || '');
        setFormData(prev => ({ ...prev, [field]: selectedValue }));
    };

    const openAddModal = () => {
        setCurrentEmployee(null);
        setFormData({
            title: '',
            first_name: '',
            last_name: '',
            email: '',
            role: '',
            mobile: '',
            status: 'active'
        });
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setCurrentEmployee(employee);
        setFormData({
            title: employee.title,
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            role: employee.role,
            mobile: employee.mobile,
            status: employee.status || 'active'
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            let updatedEmployees;

            if (currentEmployee) {
                response = await api.put(`/doctor/employee/${currentEmployee.id}`, formData);
                updatedEmployees = employees.map(emp =>
                    emp.id === currentEmployee.id ? response.data : emp
                );
            } else {
                response = await api.post('/doctor/employee/store', formData);
                updatedEmployees = [...employees, response.data.data];
            }

            setEmployees(updatedEmployees);

            if (onUpdate) {
                onUpdate({ ...doctor, employees: updatedEmployees });
            }

            Toast.fire({
                icon: 'success',
                title: currentEmployee ? 'Employee updated successfully' : 'Employee added successfully'
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving employee:', error);
            Toast.fire({
                icon: 'error',
                title: error.response?.data?.message || 'Failed to save employee'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (employeeId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the employee record',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/doctor/employee/${employeeId}`);
                const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
                setEmployees(updatedEmployees);

                if (onUpdate) {
                    onUpdate({ ...doctor, employees: updatedEmployees });
                }

                Toast.fire({ icon: 'success', title: 'Employee deleted' });
            } catch (error) {
                console.error('Error deleting employee:', error);
                Toast.fire({ icon: 'error', title: 'Failed to delete employee' });
            }
        }
    };

    const renderField = ({ type, label, name, inputType, options, required }) => {
        const commonProps = {
            name,
            label,
            value: formData[name],
            required,
            key: name
        };

        if (type === 'select') {
            return (
                <SelectField
                    {...commonProps}
                    onChange={handleSelectChange(name)}
                    options={options}
                />
            );
        }

        return (
            <InputField
                {...commonProps}
                type={inputType}
                onChange={handleInputChange}
            />
        );
    };

    const renderFieldGroup = (fields) =>
        fields.map((field) => renderField(field));

    const columns = [
        {
            header: '#',
            accessor: 'index',
            cell: (row, index) => index + 1 + (currentPage - 1) * itemsPerPage
        },

        {
            header: 'Name',
            accessor: 'name',
            cell: (row) => `${row.first_name || ''} ${row.last_name || ''}`.trim() || '-'
        },
        {
            header: 'Email',
            accessor: 'email',
            cell: (row) => row.email || '-'
        },
        {
            header: 'Role',
            accessor: 'role',
            cell: (row) => row.role || '-'
        },
        {
            header: 'Phone',
            accessor: 'mobile',
            cell: (row) => row.mobile || '-'
        },
        {
            header: 'Actions',
            accessor: 'id',
            cell: (row) => (
                <div className='flex space-x-2'>
                    <Button
                        onClick={() => openEditModal(row)}
                        variant="primary"
                        size="sm"
                        icon={<EditIcon />}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(row.id)}
                        variant="danger"
                        size="sm"
                        icon={<FaTrashAlt />}
                    >
                        Remove
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Employees</h2>
                <Button onClick={openAddModal} icon={<FiPlus />}>
                    Add Employee
                </Button>
            </div>

            <Table
                columns={columns}
                data={currentItems}
                emptyMessage="No employees found"
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={employees.length}
                totalPages={totalPages}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentEmployee ? 'Edit Employee' : 'Add New Employee'}
                size="custom"
                customWidth="500px"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {renderFieldGroup([
                            {
                                type: 'select',
                                label: 'Title',
                                name: 'title',
                                options: getTitle,
                                required: true
                            },
                            {
                                type: 'select',
                                label: 'Role',
                                name: 'role',
                                options: roles,
                                required: true
                            },
                            {
                                type: 'input',
                                label: 'First Name',
                                name: 'first_name',
                                required: true
                            },
                            {
                                type: 'input',
                                label: 'Last Name',
                                name: 'last_name',
                                required: true
                            }
                        ])}
                    </div>

                    {renderField({
                        type: 'input',
                        label: 'Email',
                        name: 'email',
                        inputType: 'email',
                        required: true
                    })}

                    <div className="grid grid-cols-2 gap-4">
                        {renderFieldGroup([
                            {
                                type: 'input',
                                label: 'Phone Number',
                                name: 'mobile'
                            },
                            {
                                type: 'select',
                                label: 'Status',
                                name: 'status',
                                options: statusOptions,
                                required: true
                            }
                        ])}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading}>
                            {currentEmployee ? 'Update' : 'Add'} Employee
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default EmployeeForm;
