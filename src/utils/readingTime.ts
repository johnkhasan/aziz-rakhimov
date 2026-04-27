/**
 * Calculates the estimated reading time of a given text.
 * Based on an average reading speed of 200 words per minute.
 * 
 * @param text The text to calculate reading time for
 * @param wordsPerMinute Average words read per minute (default: 200)
 * @returns Estimated reading time in minutes (minimum 1)
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  if (!text || text.trim().length === 0) return 1;
  
  // Split by whitespace to get word count
  const wordCount = text.trim().split(/\s+/).length;
  
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
