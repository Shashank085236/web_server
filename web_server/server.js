/**
 * Created by SHASHANK on 27-12-2015.
/*


/*
    Required modules
 */

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs'); // filesystem module

/*
 our supported mimeTypes
 */

var mimeTypes = {
    'html'  : 'text/html',
    'text'  : 'text/plain',
    'js'    :'text/javascript',
    'css'   :'text/css',
    'jpeg'  : 'image/jpeg',
    'jpg'   : 'image/jpeg',
    'png'   : 'image/png'
};

http.createServer(function(req,res){
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(),unescape(uri));
   // console.log(`loading  ${uri}`);
    var stats;
    try{
        // check if file exists
        stats = fs.lstatSync(fileName);
    }catch(e){
        res.writeHead('404',{'Content-type' : mimeTypes.text});
        res.write('404 NOT FOUND\n');
        res.end();
        return;
    }

    // check if file / directory
    if(stats.isFile()){
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200,{'Content-type' : mimeType});
        var fileSteram = fs.createReadStream(fileName);
        fileSteram.pipe(res);
    }else if(stats.isDirectory()){
        // redirect to index page
        res.writeHead(302,{
            location : 'index.html'
        });
        res.end();
    }else{
        // internal server error
        res.writeHead(500,{'Content-type' : mimeTypes.text});
        res.write('500 internal server error.')
        res.end();
    }
}).listen(3000);