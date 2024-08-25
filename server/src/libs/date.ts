import dayjs from "dayjs";

export const getCurrentDate = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  return now;
};

export const getDateFormat = (
  date?: string | Date | dayjs.Dayjs,
  utc: boolean = false,
  format: string = "YYYY-MM-DD",
) => {
  return dayjs(date || Date.now())
    .utc(utc)
    .format(format);
};
