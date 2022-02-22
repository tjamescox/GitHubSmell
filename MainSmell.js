function MainSmell(){
    // let input = document.querySelector('input');
    // let textarea = document.querySelector('textarea');
    var input = document.getElementById('Input').value;
    const puppeteer = require('puppeteer');

    const http = require('http');
    const hostname = '127.0.0.1';
    const port = 3000;
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');});
    
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);});

    (async () => {  const browser = await puppeteer.launch();  
        const page = await browser.newPage();  
        await page.goto(input);  
        await page.screenshot({ path: 'mainPage.png' });
        await browser.close();})();

    document.getElementById('Output') = "hello";
    document.getElementById("Input").addEventListener("click", displayInput);
}