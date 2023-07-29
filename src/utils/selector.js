export const identifySelectorKind = async (selector) => {
  if (selector[0] === "/") {
    return `xpath=${selector}`;
  } else {
    return selector;
  }
};

export const deleteAhrefSelector = async (selector) => {
  let str = selector.toString();
  if (str.includes("> a")) {
    return str.replace(/> a/, "");
  } else if (str.includes("/a")) {
    return str.replace(/\/a/, "");
  } else {
    return str;
  }
};
