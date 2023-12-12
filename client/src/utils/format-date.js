const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}

export default formatDate;
