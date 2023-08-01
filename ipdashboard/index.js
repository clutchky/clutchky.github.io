const http = require('http'); // node's built-in web server module

let appData = [
	{
		id: 1,
		name: "One"
	}
]

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end(JSON.stringify(appData));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server listening on port ${PORT}`);	