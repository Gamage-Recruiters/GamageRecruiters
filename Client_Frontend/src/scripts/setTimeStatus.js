const setTimeStatus = (date) =>  {
    const relevantDate = new Date(date);
    const currentDate = new Date();
    console.log(relevantDate, currentDate);

    let response;

    let dateTimeDifference = currentDate - relevantDate;
    console.log(dateTimeDifference);

    const seconds = Math.floor((dateTimeDifference / 1000) % 60);
    const minutes = Math.floor((dateTimeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((dateTimeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor((dateTimeDifference / (1000 * 60 * 60 * 24)) % 30); // avg month length
    const months = Math.floor((dateTimeDifference / (1000 * 60 * 60 * 24 * 30)) % 12);
    const years = Math.floor(dateTimeDifference / (1000 * 60 * 60 * 24 * 365.25)); // accounting leap year

    // console.log(`${years} years, ${months} months, ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);

    if(years > 0) {
        response = `${years} years ago`;
    } else {
        if(months > 0) {
            response = `${months} months ago`;
        } else {
            if(days > 0) {
                response = `${days} days ago`;
            } else {
                if(hours > 0) {
                    response = `${hours} hours ago`;
                } else {
                    if(minutes > 0) {
                        response = `${minutes} minutes ago`;
                    } else {
                        if(seconds > 0) {
                            response = `${seconds} seconds ago`;
                        } else {
                            response = `Just now`;
                        }
                    }
                }
            }
        }
    }
    return response;
}

export default setTimeStatus;