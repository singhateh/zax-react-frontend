
export const UserAvatar = ({ name }) => {
    const initials = name.split(' ')
        .slice(0, 2) // Only take first 2 words
        .map(word => word[0])
        .join('')
        .toUpperCase();

    return (
        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
            {initials}
        </div>
    );
};

export const goToBookAppointment = (navigate, appointment) => {
    navigate(`/instruct-cases/book/${appointment.id}`, {
        state: { appointment: appointment },
    });
};

export const goToEditCase = (navigate, caseData) => {
    navigate(`/instruct-cases/edit/${caseData.id}`, {
        state: { case: caseData },
    });
};

export const goToAppointmentPage = (navigate) => {
    navigate(`/instruct-cases/appointment-book-page`);
};

export const goToInstructHome = (navigate) => {
    navigate(`/instruct-cases`);
};


export const goToCreateReport = (navigate) => {
    navigate(`/instruct-cases`);
};

export const goToDoctorProfile = (navigate, data, isSetup = false) => {
    if (!data) return;
    if (!data.id) return;
    const path = isSetup
        ? `/account-settings/setup/${data.id}`
        : `/doctors/${data.id}`;

    if (navigate) {
        navigate(path, {
            state: { doctor: data },
        });
    }

    return path;
};



export const handleAddressSelect = (
    option,
    setSelectedAddress,
    setFormData,
    formData,
    defaultCountry = "United Kingdom"
) => {
    if (!option?.value) return;

    setSelectedAddress(option);
    const parts = option.value.split(',').map(part => part.trim());

    setFormData(prev => ({
        ...prev,
        address_1: parts[0] || "",
        address_2: parts[1] || "",
        address_3: parts[2] || "",
        address_4: parts[3] || "",
        county: parts[4] || "",
        country: parts[5] || defaultCountry,
        town: parts[6] || "",
        // Keep existing postcode unless the address contains one
        postcode: parts[7] || formData.postcode
    }));
};

export const handleAddressLookup = async ({
    formData,
    setErrors,
    setIsLoading,
    setAvailableAddresses,
    setSelectedAddress,
    setFormData,
    api
}) => {
    if (!formData.postcode?.trim()) {
        setErrors(prev => ({ ...prev, postcode: "Please enter a postcode" }));
        return false;
    }

    setErrors(prev => ({ ...prev, postcode: "" }));
    setIsLoading(true);

    try {
        const response = await api.post('/postcode-lookup', {
            postcode: formData.postcode.trim()
        });

        if (!response.data?.success) {
            throw new Error(response.data?.message || "Lookup failed");
        }

        const addresses = response.data.data?.addresses || [];
        setAvailableAddresses(addresses);

        if (addresses.length === 1) {
            const singleAddress = {
                value: addresses[0],
                label: addresses[0]
            };
            handleAddressSelect(
                singleAddress,
                setSelectedAddress,
                setFormData,
                formData
            );
        }

        return addresses.length > 0;
    } catch (error) {
        console.error("Postcode lookup error:", error);
        setErrors(prev => ({
            ...prev,
            postcode: error.message || "Address lookup failed"
        }));
        setAvailableAddresses([]);
        return false;
    } finally {
        setIsLoading(false);
    }
};
