function MainSmell(){
    // let input = document.querySelector('input');
    // let textarea = document.querySelector('textarea');
    document.getElementById("btn").addEventListener("click", ()=>{
        document.getElementById("Output").value = "Loading..."});
    
    let input = document.getElementById("Input").value;
    document.getElementById("btn").addEventListener("click", ()=>{
        document.getElementById("Output").value = document.getElementById("Output").value + '\n' + input});
}

const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');

//Starting server with express
const server = express();
const port = process.env.PORT || 3000;

// sendFile will go here
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/CodeSmellerWeb.html'));
  });

server.listen(port);
console.log('Server started at http://localhost:' + port);


// const http = require('http');
// const { Console } = require('console');
// const hostname = '127.0.0.1';
// const port = 3000;  
// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.write("CodeSmellerWeb.html");
//     res.end('');});
// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);}
// );

(async () => {  const browser = await puppeteer.launch();  
    const page = await browser.newPage();  
    await page.goto('https://github.com/Vipoup/Vulnerability-Scanner/blob/main/xss-attacks/server.js');  
    thing = await page.evaluate(() => {
        return document.querySelector('#LC1').textContent;
    });

    console.log(thing);
    //await page.screenshot({ path: 'mainPage.png' });
    await browser.close();}
)();