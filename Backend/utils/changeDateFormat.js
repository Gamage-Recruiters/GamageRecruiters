function setTimeStampToDate (timeStamp) {
    const date = new Date(timeStamp * 1000); // Convert seconds to milliseconds ...
    console.log(date);
    return date; // Return the date in ISO format ...
}

module.exports = setTimeStampToDate;