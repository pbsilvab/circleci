/**
 * Validate CircleCI URL
 *
 * @param url
 * @returns
 */
export const validCircleCIURL = (url) => {
  const urlObj = new URL(url);
  return urlObj.origin === "https://circleCI.com";
};
