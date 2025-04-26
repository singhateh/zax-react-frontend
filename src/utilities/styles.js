export const customStyles = (size) => ({
    control: (provided, state) => ({
        ...provided,
        height: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: 0,
        borderColor: state.isFocused
            ? (state.isInvalid ? '#EF4444' : '#3B82F6')
            : (state.isInvalid ? '#EF4444' : '#D1D5DB'),
        boxShadow: 'none',
        paddingLeft: 7,
        paddingRight: 7,
        fontSize: '0.865rem',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0,
        paddingBottom: 0,
        WebkitFlexWrap: 'none',
        flexWrap: 'none',
    }),
    menu: (provided) => ({
        ...provided,
        zIndex: 9999,
        fontSize: '0.865rem',
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
});
