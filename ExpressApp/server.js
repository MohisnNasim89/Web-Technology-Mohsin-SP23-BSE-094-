const express = require("express");
var expressLayout = require("express-ejs-layouts");

let server = express();

server.set("view engine", "ejs");
server.use(expressLayout);

server.use(express.static("public"));

const PORT = 3000;

server.get("/", (req, res) => {
    res.render("homepage", { page: "homepage" });
});

server.get("/menu", (req, res) =>{
    res.render("menu", {page: "menu"});
})

server.listen(PORT, () => {
    console.log(`Server Started at localhost:${PORT}`);
});