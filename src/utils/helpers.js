/**
 * Format price to Vietnamese currency format
 * @param {number} price - Price value to format
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  /**
   * Format date to specific format
   * @param {Date|string} date - Date to format
   * @param {string} formatStr - Format string (default: dd/MM/yyyy)
   * @returns {string} Formatted date
   */
  export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
    const d = new Date(date);
    
    // Replace format tokens with actual values
    const tokens = {
      dd: String(d.getDate()).padStart(2, '0'),
      MM: String(d.getMonth() + 1).padStart(2, '0'),
      yyyy: d.getFullYear(),
      HH: String(d.getHours()).padStart(2, '0'),
      mm: String(d.getMinutes()).padStart(2, '0'),
      ss: String(d.getSeconds()).padStart(2, '0')
    };
    
    let result = formatStr;
    Object.entries(tokens).forEach(([token, value]) => {
      result = result.replace(token, value);
    });
    
    return result;
  };
  
  /**
   * Check if two dates are the same day
   * @param {Date|string} date1 - First date
   * @param {Date|string} date2 - Second date
   * @returns {boolean} True if same day, false otherwise
   */
  export const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };
  
  /**
   * Get a range of dates from start date
   * @param {Date|string} startDate - Start date
   * @param {number} days - Number of days in range
   * @returns {Array<Date>} Array of dates
   */
  export const getDateRange = (startDate, days) => {
    const dates = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  /**
   * Convert minutes to hours and minutes format
   * @param {number} minutes - Total minutes
   * @returns {string} Formatted duration (e.g. "2h 15m")
   */
  export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    }
    
    if (mins === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${mins}m`;
  };
  
  /**
   * Truncate text to a specific length and add ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength) + '...';
  };
  
  /**
   * Group items by a specific key
   * @param {Array} array - Array of objects
   * @param {string|function} key - Key to group by
   * @returns {Object} Grouped object
   */
  export const groupBy = (array, key) => {
    return array.reduce((result, item) => {
      const keyValue = typeof key === 'function' ? key(item) : item[key];
      (result[keyValue] = result[keyValue] || []).push(item);
      return result;
    }, {});
  };
  
  /**
   * Get initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  export const getInitials = (name) => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };
  
  /**
   * Check if object is empty
   * @param {Object} obj - Object to check
   * @returns {boolean} True if empty, false otherwise
   */
  export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  /**
   * Format showtime status based on date and time
   * @param {Date|string} showDate - Show date
   * @param {string} showTime - Show time (HH:mm format)
   * @returns {string} Status (upcoming, ongoing, ended)
   */
  export const getShowtimeStatus = (showDate, showTime) => {
    const now = new Date();
    const showDateTime = new Date(showDate);
    
    // Set time from showTime string (format: "HH:mm")
    const [hours, minutes] = showTime.split(':').map(Number);
    showDateTime.setHours(hours, minutes, 0, 0);
    
    // Assume average movie duration is 2 hours
    const endTime = new Date(showDateTime);
    endTime.setHours(endTime.getHours() + 2);
    
    if (now < showDateTime) {
      return 'upcoming';
    } else if (now >= showDateTime && now <= endTime) {
      return 'ongoing';
    } else {
      return 'ended';
    }
  };
  
  /**
   * Generate placeholder avatar URL based on name
   * @param {string} name - User's name
   * @returns {string} Avatar URL
   */
  export const getAvatarUrl = (name) => {
    const initials = getInitials(name);
    // Using DiceBear API for placeholder avatars
    return `https://avatars.dicebear.com/api/initials/${initials}.svg`;
  };
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  /**
   * Validate phone number format (Vietnamese)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  export const isValidPhone = (phone) => {
    const re = /^(0|\+84)(\d{9,10})$/;
    return re.test(phone);
  };
  
  /**
   * Get user-friendly booking status
   * @param {string} status - Booking status
   * @returns {string} User-friendly status text
   */
  export const getBookingStatusText = (status) => {
    const statusMap = {
      'confirmed': 'Đã xác nhận',
      'cancelled': 'Đã hủy',
      'pending': 'Đang chờ xác nhận',
      'completed': 'Đã hoàn thành'
    };
    
    return statusMap[status] || status;
  };
  
  /**
   * Calculate age rating based on movie content
   * @param {object} movie - Movie object
   * @returns {string} Age rating (P, C13, C16, C18)
   */
  export const getAgeRating = (movie) => {
    // This is a simplified example. In a real app, this would be based on movie metadata
    if (movie.genre.some(g => ['Kinh dị', 'Terror'].includes(g))) {
      return 'C18';
    } else if (movie.genre.some(g => ['Hành động', 'Action'].includes(g))) {
      return 'C16';
    } else if (movie.genre.some(g => ['Hài', 'Comedy'].includes(g))) {
      return 'C13';
    } else {
      return 'P';
    }
  };
  
  /**
   * Get Vietnamese day of week
   * @param {Date|string} date - Date
   * @returns {string} Day of week in Vietnamese
   */
  export const getVietnameseDayOfWeek = (date) => {
    const d = new Date(date);
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return days[d.getDay()];
  };
  
  /**
   * Check if date is today
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if today, false otherwise
   */
  export const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };