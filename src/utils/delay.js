const delay = (milisecond = 3000) => {
  return new Promise((resolve) => setTimeout(resolve, milisecond));
};

export default delay;
