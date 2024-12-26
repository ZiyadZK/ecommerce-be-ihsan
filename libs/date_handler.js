const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

class DateHandler {
    constructor(tz) {
        this.tz = tz;
    }

    now(date = dayjs()) {
        return dayjs(date).tz(this.tz).format().toString(); // returns current date in specified tz
    }

    dateOnly(date = dayjs()) {
        return dayjs(date).tz(this.tz).format('YYYY-MM-DD').toString(); // returns current date in specified tz
    }

    day({ as_name = false, date = dayjs() } = {}) {
        const formattedDate = dayjs(date).tz(this.tz);
        if (as_name) {
            return formattedDate.format('dddd'); // Returns day name (e.g. 'Monday')
        }
        return formattedDate.date(); // Returns numeric day (e.g. 1, 2, 3,...)
    }

    month({ as_name = false, date = dayjs() } = {}) {
        const formattedDate = dayjs(date).tz(this.tz);
        if (as_name) {
            return formattedDate.format('MMMM'); // Returns full month name (e.g. 'January')
        }
        return formattedDate.month() + 1; // Returns numeric month (1-12)
    }

    year(date = dayjs()) {
        return dayjs(date).tz(this.tz).year(); // Returns year (e.g. 2024)
    }

    time({ format = 'HH:mm:ss', date = dayjs() } = {}) {
        return dayjs(date).tz(this.tz).format(format); // Returns formatted time (e.g. '14:30:00')
    }
}


const date_handler = (tz  = 'Asia/Jakarta') => {
    return new DateHandler(tz)
}

module.exports = date_handler

// Example usage:
// const DateHandler = require('./DateHandler');
// const dateHandler = new DateHandler('Asia/Jakarta');
// console.log(dateHandler.now());
// console.log(dateHandler.dateOnly());
// console.log(dateHandler.day({ as_name: true }));
// console.log(dateHandler.month({ as_name: false }));
// console.log(dateHandler.year());
// console.log(dateHandler.time({ format: 'HH:mm:ss' }));
