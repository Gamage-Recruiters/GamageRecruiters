const useConCatName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
}

const useChangeDateFormat = (date) => {
    if (!date) return null; // Handle empty/null values ...

    const utcDate = new Date(date);
    const options = { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" };
    
    return new Intl.DateTimeFormat("en-CA", options).format(utcDate); // YYYY-MM-DD format ...
};

export { useConCatName, useChangeDateFormat };