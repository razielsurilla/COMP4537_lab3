const DateHandler = require("./DateHandler")
const FileWriter = require("./FileWriter");
const FileReader = require("./FileReader");
const http = require('http');
const url = require('url');

class Server {
    constructor(port) {
        this.port = port;
        this.date_handler = new DateHandler();
        this.file_writer = new FileWriter();
        this.file_reader = new FileReader();
    }

    start() {
        http.createServer((req, res) => {
            const req_url = url.parse(req.url, true);

            if (req_url.pathname === '/getDate' && req.method === 'GET') {
                this.handle_get_date(req, res, req_url);
            } else if (req_url.pathname.startsWith('/writeFile')) {
                this.handle_write_file(req, res, req_url);
            } else if (req_url.pathname.startsWith('/readFile')) {
                this.handle_read_file(req, res, req_url);
            } else {
                this.handle_not_found(res);
            }
        }).listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    handle_get_date(req, res, req_url) {
        const user_name = req_url.query.name;
        const date_response = this.date_handler.get_date(user_name);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write(date_response);
        res.end();
    }

    handle_write_file(req, res, req_url) {
        const input_text = req_url.query.text || '';
        const file_path = 'file.txt';

        this.file_writer.write_to_file(file_path, input_text, (err) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/html" });
                res.write(`Error writing to file: ${err.message}`);
                res.end();
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(`Text appended to ${file_path}`);
            res.end();
        });
    }

    handle_read_file(req, res, req_url) {
        const file_path = req_url.pathname.replace('/readFile/', '');

        this.file_reader.read_from_file(file_path, (err, data) => {
            if (err) {
                res.writeHead(err.code === 'ENOENT' ? 404 : 500, { "Content-Type": "text/html" });
                res.write(err.code === 'ENOENT'
                    ? `404 Error: File not found - ${file_path}`
                    : `Error reading file: ${err.message}`);
                res.end();
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    }

    handle_not_found(res) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write("404 Not Found");
        res.end();
    }
}

const server = new Server(8000);
server.start();
