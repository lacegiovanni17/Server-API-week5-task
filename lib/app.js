"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
/*
implement your server code here
*/
const fs_1 = __importDefault(require("fs"));
const server = http_1.default.createServer((req, res) => {
    if (req.method === "GET") {
        fs_1.default.readFile('database.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Internal server error');
                return;
            }
            res.end(data);
        });
    }
    else if (req.method === "POST") {
        // Parse the request body to get the new data
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const newData = JSON.parse(body);
            // Append the new data to the database.json file
            fs_1.default.readFile('database.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal server error');
                    return;
                }
                const records = JSON.parse(data);
                records.push(newData);
                fs_1.default.writeFile('database.json', JSON.stringify(records), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.statusCode = 500;
                        res.end('Internal server error');
                        return;
                    }
                    res.end('Data added to the database!');
                });
            });
        });
    }
    if (req.method === "PUT") {
        // Parse the request body to get the updated data and the id of the record to be updated
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const { id, ...updatedData } = JSON.parse(body);
            // Read the database.json file, find the record with the matching id, and update its fields with the new data
            fs_1.default.readFile('database.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal server error');
                    return;
                }
                const records = JSON.parse(data);
                const record = records.find((r) => r.id === id);
                if (!record) {
                    res.statusCode = 404;
                    res.end('Record not found');
                    return;
                }
                Object.assign(record, updatedData);
                fs_1.default.writeFile('database.json', JSON.stringify(records), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.statusCode = 500;
                        res.end('Internal server error');
                        return;
                    }
                    res.end('Data updated in the database!');
                });
            });
        });
    }
    if (req.method === "DELETE") {
        // Parse the request body to get the id of the record to be deleted
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const { id } = JSON.parse(body);
            // Read the database.json file, find the record with the matching id, and remove it from the array of records
            fs_1.default.readFile('database.json', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal server error');
                    return;
                }
                let records = JSON.parse(data);
                records = records.filter((r) => r.id !== id);
                fs_1.default.writeFile('database.json', JSON.stringify(records), (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.statusCode = 500;
                        res.end('Internal server error');
                        return;
                    }
                    res.end('Data deleted from the database!');
                });
            });
        });
    }
});
server.listen(3005, server);
