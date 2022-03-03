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
const jsondata = require('./BadPractices.json');

//Starting server with express
const server = express();
const port = process.env.PORT || 3000;

// sendFile will go here
server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/CodeSmellerWeb.html'));
});


server.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    let response = {
       GHLink:req.query.GHLink
    };

    (async () => {  const browser = await puppeteer.launch();  
        const page = await browser.newPage();  

        //https://github.com/Vipoup/Vulnerability-Scanner/blob/main/xss-attacks/server.js
        await page.goto(response.GHLink);
        const maxSize = await page.evaluate(() => {
            //document.querySelectorAll('tr').length
            //document.querySelectorAll('td[id^=LC]').length
            return document.querySelectorAll('td[id^=LC]').length
        });

        let array1 = [];
        //put all lines into an array
        array1 = await page.evaluate((maxSize, array1) => {
            for(let i = 0; i < maxSize; i++){
                array1.push(document.querySelector('#LC' + CSS.escape(i+1)).textContent);
                //return document.querySelector('#LC${i}').textContent;
            }
            return array1;
            //return document.querySelector('#LC1').textContent;
        }, maxSize, array1);

        //compare github lines to json data
        //let num = 1;
        let counter = 0;
        let codePlacement = [];
        Object.keys(jsondata).forEach(comparison => {
            array1.forEach(lineToSearch => {
                //if this regex is above this loop, the code counts wrong for some reason
                let regex = new RegExp(comparison, "igm");
                counter++;
                if(regex.test(lineToSearch)){
                    codePlacement.push(counter);
                    //console.log(num);
                    //num = num + 1;
                }
            });

            if(codePlacement.length != 0){
                //location/lines of errors
                console.log(codePlacement);

                /*this is testing for accuracy using ctrl+f on the 
                github page and typing matching the expression*/
                //console.log(codePlacement.length);

                //display the values of the json key
                console.log(jsondata[comparison]["possibleIssue"]);
            }

            counter = 0;
            codePlacement = [];
        });

        /*array => json foreach loop version, puts all found 
        errors in 1 array, if above foreach loops commented out*/
        // array1.forEach(lineToSearch => {
        //     counter++;
        //     Object.keys(jsondata).forEach(comparison => {
        //         let regex = new RegExp(comparison, "igm");
        //         if(regex.test(lineToSearch)){
        //             codePlacement.push(counter);
        //         }
        //     });
        // });
        // console.log(codePlacement);
        // console.log(codePlacement.length);

        //know where the code is, for debugging purposes
        console.log("here");
        await browser.close();}
    )();

    res.end();
 })

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

// (async () => {  const browser = await puppeteer.launch();  
//     const page = await browser.newPage();  
//     await page.goto('https://github.com/Vipoup/Vulnerability-Scanner/blob/main/xss-attacks/server.js');  
//     thing = await page.evaluate(() => {
//         return document.querySelector('#LC1').textContent;
//     });

//     console.log(thing);
//     //await page.screenshot({ path: 'mainPage.png' });
//     await browser.close();}
// )();