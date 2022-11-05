export const formatDate = (targetDate) => {
  const modified = new Date(targetDate);
  const year = modified.getFullYear();
  const month = modified.getMonth() + 1;
  const date = modified.getDate();
  const hours = modified.getHours();
  const minutes = modified.getMinutes();
  return (
    +year + "年" + month + "月" + date + "日" + hours + "時" + minutes + "分"
  );
};
