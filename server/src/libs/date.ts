export const getCurrentDate = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  return now;
};
