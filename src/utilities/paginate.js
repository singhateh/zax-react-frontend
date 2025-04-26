export function paginate(items, currentPage, itemsPerPage) {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    return {
        currentItems,
        totalItems,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
    };
}
