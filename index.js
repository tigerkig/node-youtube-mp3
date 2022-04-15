const express = require("express");
const AdmZip = require('adm-zip');
const path = require("path");
const fs = require("fs");
const ytdl = require("ytdl-core");
const Utils = require("./utils");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 443;

// app.use(cors({origin: '*'}));
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}));
app.use("/data", express.static(path.join(__dirname, "data")));
app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
    console.log("Server running on port 3000");
});

/**
 * Downloads song info and sends it back to front (thumbnail image, author, song titile).
 * Parses youtube title to author and song title.
 */
app.get("/getInfo", async (req, res) => {
    console.log(req.query.url);
    const songInfo = await Utils.getInfo(req.query.url);
    songInfo["bitrate"] = "320k";
    songInfo["start_time"] = 0;
    songInfo["end_time"] = songInfo.duration;
    const sessionDir = `data/${songInfo.sessionID}/`;

    songInfo["songPath"] = sessionDir + songInfo.filename;
    songInfo["sessionDir"] = sessionDir;

    await Utils.downloadSong(songInfo, res);

    res.json(songInfo["songPath"]);
       
});

app.get("/download", async (req, res) => {
    const Folder = `${__dirname}/data/music`;
    console.log(`${__dirname}/${req.query.file}`);
    res.download(`${__dirname}/${req.query.file}`, function(err) {
        fs.rmdir(Folder, { recursive: true }, (err) => {

            console.log(`${Folder} is deleted!`);
        });
        
    });
})


// app.get("/multiInfo", async (req, res) => {

//     const cars = ["http://www.youtube.com/watch?v=-8VfKZCOo_I", "https://www.youtube.com/watch?v=zIF70l1zUKU","http://www.youtube.com/watch?v=AN_R4pR1hck"];

//     for(var i = 0; i < cars.length; i++){
//         var songInfo = await Utils.getInfo(cars[i]);
//         songInfo["bitrate"] = "320k";
//         songInfo["start_time"] = 0;
//         songInfo["end_time"] = songInfo.duration;
//         var sessionDir = `data/${songInfo.sessionID}/`;
//         setTimeout(() => {
//             fs.rmdirSync(sessionDir, { recursive: true });
//         }, 180 * 1000);

//         songInfo["songPath"] = sessionDir + songInfo.filename;
//         songInfo["sessionDir"] = sessionDir;
//         console.log(songInfo);

//         await Utils.downloadSong(songInfo, res); 
//     }
    
// });

app.get('/zipDownload', (req, res) => {

    var uploadDir = fs.readdirSync(__dirname+"/data/music"); 
    const zip = new AdmZip();
    
    for(var i = 0; i < uploadDir.length;i++){
        if(path.extname(__dirname+"/data/music/"+uploadDir[i]) == ".mp3") {
            zip.addLocalFile(__dirname+"/data/music/"+uploadDir[i]);
        }

    }
    const downloadName = `${Date.now()}.zip`;
    const data = zip.toBuffer();
    zip.writeZip(__dirname+"/"+downloadName);
    
    res.download(downloadName, function(err) {
        if (err) {
            console.log(err); 
        }
        fs.unlinkSync(downloadName) 
    });
 
})
