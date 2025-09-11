import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

// Pakistan Standard Time (UTC+5)
export const PAKISTAN_TIMEZONE = 'Asia/Karachi';

/**
 * Convert UTC datetime to Pakistan time
 */
export const toPakistanTime = (utcDate: Date): Date => {
  return toZonedTime(utcDate, PAKISTAN_TIMEZONE);
};

/**
 * Convert Pakistan time to UTC
 */
export const fromPakistanTime = (pakistanDate: Date): Date => {
  return fromZonedTime(pakistanDate, PAKISTAN_TIMEZONE);
};

/**
 * Format time in Pakistan timezone with 12-hour format
 */
export const formatPakistanTime = (date: Date, pattern: string = 'h:mm a'): string => {
  return formatInTimeZone(date, PAKISTAN_TIMEZONE, pattern);
};

/**
 * Format datetime in Pakistan timezone
 */
export const formatPakistanDateTime = (date: Date): string => {
  return formatInTimeZone(date, PAKISTAN_TIMEZONE, 'EEEE, MMMM do, yyyy h:mm a');
};

/**
 * Get current time in Pakistan timezone
 */
export const getCurrentPakistanTime = (): Date => {
  return toPakistanTime(new Date());
};

/**
 * Check if time is within Pakistan business hours (9 AM - 5 PM PKT)
 */
export const isWithinPakistanBusinessHours = (date: Date): boolean => {
  const pakistanTime = toPakistanTime(date);
  const hour = pakistanTime.getHours();
  return hour >= 9 && hour < 17; // 9 AM to 5 PM
};

/**
 * Create a time slot in Pakistan timezone
 */
export const createPakistanTimeSlot = (date: Date, hour: number): Date => {
  const pakistanDate = new Date(date);
  pakistanDate.setHours(hour, 0, 0, 0);
  return fromPakistanTime(pakistanDate); // Convert to UTC for storage
};