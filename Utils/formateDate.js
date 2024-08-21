exports.formatDate = (date, groupBy) => {
  if (groupBy === "month") {
    return moment(date).startOf("month").format("YYYY-MM");
  }
  return moment(date).format("YYYY-MM-DD");
};
