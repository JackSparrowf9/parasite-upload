import latinize from "latinize";

const STR = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const createSlug = (str) => {
  let tmp = [];
  for (let i = 0; i < 8; i++) {
    tmp.push(STR[Math.floor(Math.random() * STR.length)]);
  }
  return latinize(str).toLowerCase().replace(/ /g, "-") + "-" + tmp.join("");
};
