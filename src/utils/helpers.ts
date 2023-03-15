export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const isValidUrl = (str: string) => {
  try {
    new URL(str);
  } catch (e) {
    return false;
  }
  return true;
};
