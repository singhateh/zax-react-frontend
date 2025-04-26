import React from 'react';
import Swal from 'sweetalert2';
import { STATUS_CLASSES } from '../../../utilities/constant';
import "./ShowSlot.css"

const ShowSlot = ({ appointment }) => {

    const handleShowSlot = () => {
        if (!appointment) return;

        const modalTitle = `Appointment Details - Dr. ${appointment.expert?.name || 'N/A'}`;

        Swal.fire({
            title: modalTitle,
            html: `
                <div class="appointment-modal">
                    <div class="appointment-info">
                        <p><strong>Doctor:</strong> ${appointment.expert?.name || 'N/A'}</p>
                        <p><strong>Patient:</strong> ${appointment.claimant_name || 'N/A'}</p>
                        <p><strong>Status:</strong> 
                            <span class="badge ${STATUS_CLASSES[appointment.status] || STATUS_CLASSES.default}">
                                ${appointment.status || 'Unknown'}
                            </span>
                        </p>
                        <p><strong>Slot Date:</strong> ${appointment.slot_date || 'N/A'}</p>
                        <p><strong>Time:</strong> ${appointment.start_time} - ${appointment.end_time}</p>
                        <p><strong>Venue:</strong> ${appointment.venue_name || 'N/A'}</p>
                        <p><strong>Appointment Type:</strong> ${appointment.appointment_type || 'N/A'}</p>
                        <p><strong>Reason:</strong> ${appointment.reason || 'Not specified'}</p>
                        <p><strong>Claimant Contact:</strong> ${appointment.claimant_mobile || 'N/A'}</p>
                        <p><strong>Agency Company:</strong> ${appointment.agency_company || 'N/A'}</p>
                        <p><strong>Notes:</strong> ${appointment.appointment_note || 'No notes'}</p>
                        <p><strong>Confirmed:</strong> ${appointment.is_confirm ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            `,
            showCancelButton: false,
            confirmButtonText: 'Close',
            confirmButtonColor: '#3085d6',
            customClass: {
                popup: 'custom-modal-class',
                confirmButton: 'custom-confirm-btn',
            },
            didOpen: () => {
                document.querySelector('.swal2-popup').style.borderRadius = '10px';
                document.querySelector('.swal2-html-container').style.textAlign = 'left';
            }
        });
    };

    return (
        <button onClick={handleShowSlot} className="btn btn-info">
            Show Appointment Details
        </button>
    );
};

export default ShowSlot;
