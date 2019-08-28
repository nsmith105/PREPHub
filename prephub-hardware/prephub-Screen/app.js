/**
 * This server handles hosting a local server
 * for the carousel page
 */
const express = require("express");
const app = express();
var serveIndex = require('serve-index')

const port = 8082;

app.use(express.static(__dirname + "/public"));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/images', express.static(__dirname + '/public/images'), serveIndex(__dirname +'/public/images'))


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/templates/screen.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
