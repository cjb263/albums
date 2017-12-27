let fs = require('fs');
let formidable = require('formidable');
let time = require('silly-datetime');
let path  =require('path');
let multer  = require('multer');
let imagesize = require('image-size');
let {random,round} = Math;

//获取相册内容
exports.getPhotos = (folder,cb)=>{
	fs.readdir('./uploads/'+folder,(error,files)=>{
		let count = files.length;
		let tupian = {folder,files:[],eachsize:[],count,sizes:0};
		
		files.forEach(function(file){
			let stat = fs.statSync('./uploads/'+folder+'/'+file);
			let _size = round(stat.size/1024);
			tupian.eachsize.push(_size+'KB');
			tupian.files.push(file);
			tupian.sizes+=_size;
		});
		tupian.sizes+='KB';
		cb(tupian);
	});
};

//获取所有相册
exports.getFolders = (cb)=>{
	fs.readdir('./uploads',(error,folders)=>{
		let folder = [];
		folders.forEach(function(fd){
			folder.push(fd);
		});
		cb(folder);
	});
};

//上传图片 formidable
exports.uploadFiles = (request,uploaddir,cb)=>{
		let form = new formidable.IncomingForm();
    	form.uploadDir = uploaddir;
    	form.parse(request, (err, fields, files)=> { 
    		 //for(let k in files){
    		   let sd  = time.format(new Date(),'YYYYMMDDHHmmss');
		       let extname = path.extname(files.tupian.name);
    		   let oldname = files.tupian.path;
		       let newname = uploaddir+'/'+sd+extname;
		       console.log(files.tupian);
		       fs.renameSync(oldname,newname); 
		       cb();
    	});
    	return;
};
//上传图片 multer
exports.uploadFiles2 = (request,response,uploaddir,callback)=>{
	let storage = multer.diskStorage({
	destination:  (request, file, cb)=> {
	    cb(null, uploaddir)
	  },
	 filename:  (request, file, cb) =>{
	    let fileFormat =path.extname(file.originalname);
	    cb(null, Date.now() + fileFormat);
	  }
	});
	let fileFilter = (request,file,cb)=>{
		if(/^image\/(\w)+$/.test(file.mimetype)){
			cb(null, true);
		}else{
			cb(null,false);
		}
	};
	let upload = multer({storage,fileFilter});
	let ups = upload.array('tupian');
	ups(request,response,(error)=>{
		if(error){
			throw error;
		}else{
			callback();
		}
	});
};

//删除图片
exports.deletFiles = (folder,file,cb)=>{
	fs.unlink('./uploads/'+folder+'/'+file, (error) =>{
		if(error){
			cb(0);
		}else{
			cb(1);
		}
	})
};
//删除相册
exports.getSingleFolder = (folder,cb)=>{
	
	fs.readdir('./uploads/'+folder, (error,files)=> {
		let len = files.length;
		if(files&&len>0){
			let singfile = files[0];
			cb('./uploads/'+folder+'/'+singfile,len);
		}else{
			cb('',0);
		}
	})
};
//获取图片大小
exports.getSinglePhoto = (folder,file,cb)=>{
	let path = './uploads/'+folder+'/'+file;
	imagesize(path,(error,pixels)=>{
		if(error){
			return;
		}
		cb(
			pixels.width,pixels.height
		);
	});
}
//增加相册
exports.addFolder = (folder,cb)=>{
	//只允许英文
	let  reg =/^[A-Za-z]+$/g;

	if(reg.test(folder)){

	let path = './uploads/'+folder;
	fs.mkdir(path,(error)=>{
		if(error){
			cb(0);
			return;
		}
			cb(1);
		});
	}else{
		cb(-1);
	}
};
//删除相册
exports.delFolder = (folder,cb)=>{
	let path = './uploads/'+folder;
	fs.readdir(path, (error,files)=>{
		if(error){
			cb(0); //发生错误
			return;
		}
		if(files.length>0){
			cb(-1); //存在图片，不能删除
			return;
		}else{
			fs.rmdir(path,(error)=>{
				if(error)
				{
					cb(0); //发生错误
					return;
				}
				cb(1); //删除成功
			});
		}

	});
};