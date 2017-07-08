const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

var mimeTypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpeg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css",
} 

//Create Server Function

const server = http.createServer((req,res) => {
  let uri = url.parse(req.url).pathname;
  let fileName = path.join(process.cwd(),unescape(uri));
  console.log('Loading '+ uri);
    var stats;
    
    try{
       stats = fs.lstatSync(fileName) 
    }catch(e){
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }
    
    //Check if File/Directory
        if(stats.isFile()){
            var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]
            res.writeHead(200,{'Content-Type': mimeType});
    
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    }else if(stats.isDirectory()){
        res.writeHead(302,{
            'Location' : 'index.html'
        });
        res.end();
    }else{
        res.writeHead(500, {'Content-Type' : 'text/plain'});
        res.write('500 Internal Server Error\n');
        res.end();
    }
});

server.listen(port);
