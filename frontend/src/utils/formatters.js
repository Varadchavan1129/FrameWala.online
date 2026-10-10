// formatters.js
// Reusable formatting utilities

export const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
