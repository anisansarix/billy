/**
 * Formats a raw YYYY-MM-DD or ISO date string into a beautiful readable format (e.g., 24 Mar 2024).
 * Strips timezones manually to ensure the day doesn't shift unexpectedly.
 * 
 * @param dateStr Raw date string
 * @returns Formatted date string
 */
export const formatDate = (dateStr?: string | Date | null): string => {
    if (!dateStr) return 'N/A';
    
    // Convert Date object to string if necessary
    const str = dateStr instanceof Date ? dateStr.toISOString() : dateStr;
    
    // Handle YYYY-MM-DD format manually to avoid timezone issues
    const parts = str.split('T')[0].split('-');
    if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [year, month, day] = parts;
        return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
    }
    
    return str; // Fallback
};

export const getCurrentFinancialYear = (fiscalYearStart: 'APRIL' | 'JANUARY' = 'APRIL', date?: Date): string => {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-11
    
    if (fiscalYearStart === 'JANUARY') {
        return `${year.toString().slice(-2)}`;
    }
    
    // APRIL start (Indian FY)
    if (month >= 3) { // Apr to Dec
        return `${year.toString().slice(-2)}-${(year + 1).toString().slice(-2)}`;
    } else { // Jan to Mar
        return `${(year - 1).toString().slice(-2)}-${year.toString().slice(-2)}`;
    }
};
