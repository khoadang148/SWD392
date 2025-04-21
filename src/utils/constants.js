/**
 * Application constants
 */

// API Base URL
export const API_BASE_URL = 'http://localhost:3001';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'cinema_booking_token',
  USER_ID: 'cinema_booking_user_id',
  LANGUAGE: 'cinema_booking_language'
};

// Movie Categories
export const MOVIE_CATEGORIES = {
  ALL: 'all',
  NOW_PLAYING: 'now-playing',
  UPCOMING: 'upcoming'
};

// Movie Genres
export const MOVIE_GENRES = [
  'Hành động',
  'Phiêu lưu',
  'Hoạt hình',
  'Hài',
  'Tội phạm',
  'Tài liệu',
  'Chính kịch',
  'Gia đình',
  'Fantasy',
  'Lịch sử',
  'Kinh dị',
  'Âm nhạc',
  'Bí ẩn',
  'Lãng mạn',
  'Khoa học viễn tưởng',
  'Phim truyền hình',
  'Kinh dị',
  'Chiến tranh',
  'Viễn tây'
];

// Seat Types
export const SEAT_TYPES = {
  STANDARD: 'standard',
  VIP: 'vip',
  COUPLE: 'couple',
  DISABLED: 'disabled'
};

// Booking Status
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  CASH: 'cash',
  MOMO: 'momo',
  ZALO_PAY: 'zalo_pay',
  VN_PAY: 'vn_pay'
};

// Age Ratings
export const AGE_RATINGS = {
  P: 'P', // Phổ thông
  C13: 'C13', // 13 tuổi trở lên
  C16: 'C16', // 16 tuổi trở lên
  C18: 'C18' // 18 tuổi trở lên
};

// Routes
export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  MOVIE_DETAIL: '/movies/:id',
  BOOKING_SEATS: '/booking/seats',
  BOOKING_CHECKOUT: '/booking/checkout',
  LOGIN: '/login',
  PROFILE: '/profile'
};

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^(0|\+84)(\d{9,10})$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Theater Rows & Columns Configuration
export const THEATER_CONFIG = {
  MAX_ROWS: 10,
  MAX_COLUMNS: 16,
  ROW_LABELS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  VIP_ROWS: ['D', 'E', 'F']
};

// Booking Session Timeout (in milliseconds)
export const BOOKING_TIMEOUT = 15 * 60 * 1000; // 15 minutes

// Image Placeholders
export const PLACEHOLDER_IMAGES = {
  MOVIE_POSTER: 'https://via.placeholder.com/300x450?text=No+Poster',
  USER_AVATAR: 'https://via.placeholder.com/150?text=User'
};

// Languages
export const LANGUAGES = {
  VIETNAMESE: 'vi',
  ENGLISH: 'en'
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
  NETWORK: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập vào tính năng này.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  LOGIN: {
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
    REQUIRED_FIELDS: 'Vui lòng nhập đầy đủ email và mật khẩu.'
  },
  REGISTER: {
    EMAIL_EXISTS: 'Email đã được sử dụng.',
    WEAK_PASSWORD: 'Mật khẩu phải có ít nhất 6 ký tự.',
    INVALID_PHONE: 'Số điện thoại không hợp lệ.',
    REQUIRED_FIELDS: 'Vui lòng nhập đầy đủ thông tin.'
  },
  BOOKING: {
    NO_SEATS: 'Vui lòng chọn ít nhất một ghế.',
    TIMEOUT: 'Phiên đặt vé đã hết hạn. Vui lòng thực hiện lại.',
    SEAT_UNAVAILABLE: 'Ghế đã được đặt. Vui lòng chọn ghế khác.'
  }
};