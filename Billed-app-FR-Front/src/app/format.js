// export const formatDate = (dateStr) => {
//   const date = new Date(dateStr)
//   const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
//   const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
//   const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
//   const month = mo.charAt(0).toUpperCase() + mo.slice(1)
//   return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
// }


export const formatDateForSorting = (dateStr) => {
  const date = new Date(dateStr);
  return date.getTime(); 
}

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
 // Check if the date is valid
 if (isNaN(date.getTime())) {
  return "Invalid Date";
}

const day = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date);
const month = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date);
const year = new Intl.DateTimeFormat('fr', { year: '2-digit' }).format(date);

return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
}

 
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}