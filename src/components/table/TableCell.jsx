// components/table/TableCell.jsx
export const TableCell = ({
    children,
    className = '',
    mobileLabel,
    align = 'left',
    isAction = false
}) => {
    const alignmentClasses = {
        left: 'text-left justify-start',
        center: 'text-center justify-center',
        right: 'text-right justify-end'
    };

    return (
        <div className={`
        ${className} 
        ${alignmentClasses[align]}
        ${isAction ? 'flex items-center' : ''}
      `}>
            {mobileLabel && (
                <span className="md:hidden font-medium mr-2">{mobileLabel}:</span>
            )}
            {children}
        </div>
    );
};