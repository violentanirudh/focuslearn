const generateSlug = (str) => {
    return str
        .toLowerCase()                         // Convert to lowercase
        .trim()                                // Trim whitespace from both ends
        .replace(/[^a-z0-9\s-]/g, '')          // Remove special characters
        .replace(/\s+/g, '-')                  // Replace spaces with hyphens
        .replace(/-+/g, '-');                  // Remove multiple hyphens
}

module.exports = {
    generateSlug
}