/**
 * Rating & Review Validation Utilities
 * Validate user input before sending to backend
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const RATING_CONSTRAINTS = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 2000,
  MAX_TITLE_LENGTH: 255,
};

/**
 * Validate review form data
 */
export function validateReviewForm(
  rating: number,
  title: string,
  content: string
): ValidationResult {
  const errors: string[] = [];

  // Validate rating
  if (!rating || rating < RATING_CONSTRAINTS.MIN_RATING || rating > RATING_CONSTRAINTS.MAX_RATING) {
    errors.push(`Điểm đánh giá phải từ ${RATING_CONSTRAINTS.MIN_RATING}-${RATING_CONSTRAINTS.MAX_RATING}`);
  }

  // Validate title
  if (title && title.trim().length > RATING_CONSTRAINTS.MAX_TITLE_LENGTH) {
    errors.push(`Tiêu đề không được vượt quá ${RATING_CONSTRAINTS.MAX_TITLE_LENGTH} ký tự`);
  }

  // Validate content
  const contentTrimmed = content.trim();
  if (!contentTrimmed) {
    errors.push('Nội dung đánh giá là bắt buộc');
  } else if (contentTrimmed.length < RATING_CONSTRAINTS.MIN_CONTENT_LENGTH) {
    errors.push(
      `Nội dung đánh giá phải từ ${RATING_CONSTRAINTS.MIN_CONTENT_LENGTH} ký tự (hiện có ${contentTrimmed.length})`
    );
  } else if (contentTrimmed.length > RATING_CONSTRAINTS.MAX_CONTENT_LENGTH) {
    errors.push(`Nội dung đánh giá không được vượt quá ${RATING_CONSTRAINTS.MAX_CONTENT_LENGTH} ký tự`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize review text input
 */
export function sanitizeReviewInput(input: string): string {
  return input
    .trim()
    .substring(0, RATING_CONSTRAINTS.MAX_CONTENT_LENGTH)
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Sanitize title input
 */
export function sanitizeTitle(input: string): string {
  return input
    .trim()
    .substring(0, RATING_CONSTRAINTS.MAX_TITLE_LENGTH)
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Check if error is related to missing appointment
 */
export function isAppointmentError(message: string): boolean {
  const appointmentKeywords = [
    'hoàn thành',
    'khám bệnh',
    'appointment',
    'completed',
    'cuộc hẹn',
  ];

  const lowerMessage = message.toLowerCase();
  return appointmentKeywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: string): string {
  if (isAppointmentError(error)) {
    return 'Bạn cần hoàn thành cuộc hẹn khám bệnh với bác sĩ này trước khi có thể đánh giá.';
  }

  if (error.includes('đã nhận xét')) {
    return 'Bạn đã đánh giá bác sĩ này rồi. Vui lòng chỉnh sửa đánh giá cũ thay vì tạo mới.';
  }

  if (error.includes('không tìm thấy')) {
    return 'Không tìm thấy bác sĩ hoặc thông tin không chính xác. Vui lòng thử lại.';
  }

  // Default message for other errors
  return error || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.';
}
