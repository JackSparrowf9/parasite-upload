import fs from "fs";

export const ensureDirExist = async (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }, (err) => {
      if (err) {
        console.log(err);

        return false;
      }
      return true;
    });
  }
  return true;
};

export const ensureFileExist = async (path) => {
  try {
    if (fs.existsSync(path)) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
