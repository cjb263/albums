/**
 * [fs description]
 * @type {[type]}
 */
let fs = require('fs');
/**
 * [formidable description]
 * @type {[type]}
 */
let formidable = require('formidable');
/**
 * [path description]
 * @type {[type]}
 */
let path  =require('path');
/**
 * [multer description]
 * @type {[type]}
 */
let multer  = require('multer');
/**
 * [imagesize description]
 * @type {[type]}
 */
let imagesize = require('image-size');
/**
 * 
 */
let {random,round} = Math;

/**获取相册内容
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.getPhotos = (response,folder,cb)=>{
	fs.readdir('./uploads/'+folder,(error,files)=>{
		if(error){
			response.redirect('/');
			return;
		}
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
/**获取所有相册
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.getFolders = (response,cb)=>{
	fs.readdir('./uploads',(error,folders)=>{
		if(error){
				response.redirect('/');
			}else{
			let folder = [];
			folders.forEach(function(fd){
				folder.push(fd);
			});
			cb(folder);
		}
	});
};
/**上传图片 formidable
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.uploadFiles = (request,response,uploaddir,cb)=>{
		fs.access(uploaddir,(error)=>{
			if(error){
				response.redirect('/');
			}else{
					let form = new formidable.IncomingForm();
    		form.uploadDir = uploaddir;
    		form.parse(request, (err, fields, files)=> { 
			if(error){
				response.redirect('/');
				return;
			}
		   let sd  = new Date();
	       let extname = path.extname(files.tupian.name);
		   let oldname = files.tupian.path;
	       let newname = uploaddir+'/'+sd+extname;
	       console.log(files.tupian);
	       fs.renameSync(oldname,newname); 
	       cb();
		});
    	return;	
		}
	});
};
/**上传图片 multer
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.uploadFiles2 = (request,response,uploaddir,callback)=>{
	fs.access(uploaddir,(error)=>{
		if(error)
		{
			response.redirect('/');
		}else{
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
				response.redirect('/');
				throw error;
			}else{
				callback();
			}
			});	
		}
	});

};
/**删除图片
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.deletFiles = (folder,file,cb)=>{
	fs.unlink('./uploads/'+folder+'/'+file, (error) =>{
		if(error){
			cb(0);
		}else{
			cb(1);
		}
	})
};
/**删除相册
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
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
/**获取图片大小
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.getSinglePhoto = (folder,file,cb)=>{
	let path = './uploads/'+folder+'/'+file;
	imagesize(path,(error,pixels)=>{
		if(error){
			cb(1,1);
			return;
		}
		cb(
			pixels.width,pixels.height
		);
	});
}
/**增加相册
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
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
/**删除相册
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
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
/**错误
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.error = (statuscode,cb)=>{
	cb(statuscode);
};