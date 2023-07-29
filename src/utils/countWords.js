export const wordCount = (string) => {
  let str = string.replace("/\n\n/", " ");
  str = string.replace("/\n/", " ");
  return str.trim().split(/\s+/).length;
};
