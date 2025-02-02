const fs = require('fs');

class FileWriter {
    write_to_file(file_path, text, callback) {
        fs.appendFile(file_path, text + '\n', callback);
    }
}
module.exports = FileWriter;