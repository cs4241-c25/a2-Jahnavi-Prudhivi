const http = require("node:http"),
    fs = require("node:fs"),
    mime = require("mime"),
    dir = "public/",
    port = 3000;

let tasks = [];

const server = http.createServer(function(request, response) {
    if (request.method === "GET") {
        handleGet(request, response);
    } else if (request.method === "POST") {
        handlePost(request, response);
    } else if (request.method === "PUT") {
        handlePut(request, response);
    } else if (request.method === "DELETE") {
        handleDelete(request, response);
    }
});

const handleGet = function(request, response) {
    if (request.url === "/tasks") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(tasks));
    } else {
        const filename = dir + (request.url === "/" ? "index.html" : request.url.slice(1));
        sendFile(response, filename);
    }
};

const handlePost = function(request, response) {
    let dataString = "";

    request.on("data", function(data) {
        dataString += data;
    });

    request.on("end", function() {
        const taskData = JSON.parse(dataString);
        tasks.push(taskData);
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(tasks));
    });
};

const handlePut = function(request, response) {
    const taskId = parseInt(request.url.split('/')[2]); // Get task ID from URL
    let dataString = "";

    request.on("data", function(data) {
        dataString += data;
    });

    request.on("end", function() {
        const updatedTask = JSON.parse(dataString);

        if (tasks[taskId]) {
            tasks[taskId] = updatedTask; // Update the task with new data
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify(tasks));
        } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ error: "Task not found" }));
        }
    });
};

const handleDelete = function(request, response) {
    const taskId = parseInt(request.url.split('/')[2]); // Get task ID from URL

    if (tasks[taskId]) {
        tasks.splice(taskId, 1); // Remove the task from the array
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(tasks));
    } else {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Task not found" }));
    }
};

const sendFile = function(response, filename) {
    const type = mime.getType(filename);
    fs.readFile(filename, function(err, content) {
        if (err === null) {
            response.writeHead(200, { "Content-Type": type });
            response.end(content);
        } else {
            response.writeHead(404);
            response.end("404 Error: File Not Found");
        }
    });
};

server.listen(process.env.PORT || port);
