import ReactDOMServer from 'react-dom/server'; // Import for rendering React components to static markup
import Swal from "sweetalert2";
// import '../../styles/swal.css';

import { CheckCircle, XCircle, AlertTriangle, Info, Trash, Plus, Trash2Icon } from 'lucide-react'; // Import the icons you need

// Convert icons to SVG string using ReactDOMServer
const icons = {
    success: ReactDOMServer.renderToStaticMarkup(<CheckCircle size={50} color="#28a745" />),
    error: ReactDOMServer.renderToStaticMarkup(<XCircle size={50} color="#dc3545" />),
    warning: ReactDOMServer.renderToStaticMarkup(<AlertTriangle size={50} color="#ffc107" />),
    info: ReactDOMServer.renderToStaticMarkup(<Info size={50} color="#17a2b8" />),
    delete: ReactDOMServer.renderToStaticMarkup(<Trash2Icon size={150} color="#d33" />),
    toast: ReactDOMServer.renderToStaticMarkup(<Plus size={30} color="#6c757d" />),
};

const CustomAlert = {
    show: async ({ type, title, text, onConfirm }) => {
        let options = {
            title: title || "Alert",
            text: text || "",
            iconHtml: icons[type] || icons["info"],
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            showCancelButton: ["delete", "warning"].includes(type),
            reverseButtons: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: "swal2-glassmorphism",
                confirmButton: "swal2-animated-button",
                cancelButton: "swal2-animated-button",
                icon: "swal2-custom-icon",
            },
        };

        if (type === "delete") {
            options = {
                ...options,
                title: "Confirm Deletion",
                html: ` 
                    <div style="text-align: center;">
                        <p>Are you sure you want to <strong>permanently delete</strong> this?</p>
                        <p class="undotext">This action <u>cannot</u> be undone.</p>
                        <label class="custom-checkbox">
                            <input type="checkbox" id="confirmDelete"/>
                            <span class="checkmark"></span>
                        </label>
                        <label for="confirmDelete" style="margin-left: 5px; cursor: pointer;">I understand the consequences</label>
                    </div>
                `,
                didOpen: () => {
                    const confirmCheckbox = document.getElementById("confirmDelete");
                    const confirmButton = Swal.getConfirmButton();
                    confirmButton.disabled = true;

                    confirmCheckbox.addEventListener("change", () => {
                        confirmButton.disabled = !confirmCheckbox.checked;
                    });
                },
            };
        }

        if (type === "toast") {
            return Swal.fire({
                title,
                text,
                iconHtml: icons[type],
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }

        const result = await Swal.fire(options);
        if (result.isConfirmed && onConfirm) {
            onConfirm();
        }
    },
};

export default CustomAlert;
