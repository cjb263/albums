var express = require('express');
var router = require('./controller');

var app = express();

app.set('view engine','ejs');

//static
app.use('/static',express.static('./public'));
app.use('/uploads',express.static('./uploads'));

//index.html
app.get('/',router.showIndex);
//get first folders image
app.get('/single/:folder',router.singleFolder);
//folders
app.get('/photos/:folder',router.showPhotos);
//upload 采用 formidable 模式
//app.use('/upload/:folder',router.uploadPhotos);
//upload 采用 multer 模式
app.use('/upload/:folder',router.uploadPhotos2);
//delete
app.post('/deletefile/:folder/:file',router.deletePhotos);
//get single photo
app.get('/get/:folder/:file',router.getSinglePhoto);
//add folder
app.get('/folder/add/:folder',router.addFolder);
//delete folder
app.post('/folder/del/:folder',router.delFolder);

app.listen(3000,'127.0.0.1');