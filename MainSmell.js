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
server.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, '/indextest.html'));
});

let array = []
server.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    let response = {
       GHLink:req.query.GHLink
    };

    //res.setHeader('Content-Type', 'text/html');

    (async () => {  const browser = await puppeteer.launch();  
        const page = await browser.newPage();  

        //https://github.com/Vipoup/files-to-scan/blob/main/CodeWithBadPractices.js
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
            }
            return array1;
        }, maxSize, array1);

        //compare github lines to json data
        let counter = 0;
        let codePlacement = [];
        Object.keys(jsondata).forEach(comparison => {
            array1.forEach(lineToSearch => {
                //if this regex is above this loop, the code counts wrong for some reason
                let regex = new RegExp(String(comparison), "igm");
                counter++;
                if(regex.test(lineToSearch)){
                    codePlacement.push(counter);
                }
            });

            if(codePlacement.length != 0){
                //location/lines of errors
                array.push(codePlacement);

                /*this is testing for accuracy using ctrl+f on the 
                github page and typing matching the expression*/
                //console.log(codePlacement.length);

                //display the values of the json key
                array.push(jsondata[comparison]["possibleIssue"]);
                array.push(jsondata[comparison]["issueLinkInfo"]);
                array.push(jsondata[comparison]["issueLinkFix"]);
            }

            counter = 0;
            codePlacement = [];
        });

        //know where the code is, for debugging purposes
        //console.log("here");
        await browser.close();}
    )();
    
    for(output in array){
        res.write(String(array[output]));
        res.write("\n");
    }

    res.end();
 })


server.listen(port);
console.log('Server started at http://localhost:' + port);
