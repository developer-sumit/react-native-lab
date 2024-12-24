/**
 * Retries a given asynchronous task a specified number of times with a delay between attempts.
 *
 * @param task - The asynchronous task to be retried. It should be a function that returns a Promise.
 * @param retries - The number of retry attempts. Default is 3.
 * @param delay - The delay between retry attempts in milliseconds. Default is 1000 ms.
 * @returns A Promise that resolves if the task succeeds within the given retries, or rejects if all attempts fail.
 * @throws The error from the last failed attempt if the task does not succeed within the given retries.
 *
 * @example
 * ```
 * const success = Math.random() > 0.5;
 * if (!success) {
 *  throw new Error("Fetch failed");
 * }
 * console.log("Data fetched successfully");
 *
 * retry(fetchData, 5, 2000)
 *   .then(() => console.log("Task completed successfully"))
 *   .catch((error) => console.error("Task failed after retries:", error));
 * ```
 */
export default async function retry(
  task: () => Promise<void>,
  retries = 3,
  delay = 1000
): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await task();
      // console.log(green("Task succeeded."));
      return; // Exit if the task succeeds
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt === retries - 1) {
        console.error("Max retries reached. Task failed.");
        throw error;
      }
      console.warn(`Retrying... (${attempt + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
    }
  }
}
