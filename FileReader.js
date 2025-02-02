const fs = require('fs');

class FileReader {
    read_from_file(file_path, callback) {
        fs.readFile(file_path, 'utf8', callback);
    }
}
module.exports = FileReader;