export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const slugify = (text) => {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
};
