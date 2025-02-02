const utils = require('./modules/utils');
const en = require('./lang/en/en');

class DateHandler {
    get_date(name) {
        const user_name = name || "NULL";
        return `${en.USER.DATE_TIME.replace("%s", user_name)} ${utils.get_date()}`;
    }
}

module.exports = DateHandler;