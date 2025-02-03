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
    } else {
        response.writeHead(405, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Method Not Allowed" }));
    }
});

const handleGet = function(request, response) {
    const filename = dir + request.url.slice(1);
    if (request.url === "/") {
        sendFile(response, "public/index.html");
    } else if (request.url === "/tasks") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(tasks));
    } else {
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
    const taskId = parseInt(request.url.split('/')[2]); // Extract task ID from URL

    if (isNaN(taskId) || taskId < 0 || taskId >= tasks.length) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Invalid task ID" }));
        return;
    }

    let dataString = "";
    request.on("data", function(data) {
        dataString += data;
    });

    request.on("end", function() {
        const updatedTask = JSON.parse(dataString);
        tasks[taskId] = updatedTask; // Update task

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(tasks));
    });
};

const handleDelete = function(request, response) {
    const taskId = parseInt(request.url.split('/')[2]); // Extract task ID from URL

    if (isNaN(taskId) || taskId < 0 || taskId >= tasks.length) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Invalid task ID" }));
        return;
    }

    tasks.splice(taskId, 1); // Remove task

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(tasks));
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

server.listen(process.env.PORT || port, () => {
    console.log(`Server running on port ${process.env.PORT || port}`);
});
