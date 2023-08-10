export const getStringDate = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month < 10) month = `0${month}`;
  if (date < 10) date = `0${day}`;
  return `${year}-${month}-${day}`;
};
