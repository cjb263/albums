/**
 * [photos description]
 * @type {[type]}
 */
let photos = require('../models/');

/**首页
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.showIndex = (request,response,next)=>{
	photos.getFolders(response,(folders)=>{
		response.render('albums',{folders});
	});
};

/**相册
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.showPhotos= (request,response,next)=>{
	 let folder = request.params.folder;
	 photos.getPhotos(response,folder,(albums)=>{
		response.render('shows',{albums,folder});
	 });
};

/**上传 formidable
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.uploadPhotos  = (request,response,next)=>{
	 let folder = request.params?request.params.folder:'share';
	 if(request.method.toLowerCase()=='post'){
	 	photos.uploadFiles(request,response,'./uploads/'+folder,()=>{
	 		response.redirect('/photos/'+folder);
	 	});
	 	return;
	 };
	 response.render('upload',{folder});
};

/**上传 multer
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.uploadPhotos2  = (request,response,next)=>{
	 let folder = request.params?request.params.folder:'share';
	 if(request.method.toLowerCase()=='post'){
	 	photos.uploadFiles2(request,response,'./uploads/'+folder,()=>{
	 		response.redirect('/photos/'+folder);
	 	});
	 	return;
	 }
	 response.render('upload',{folder});
};

/**删除相册
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.deletePhotos = (request,response,next)=>{
	if(request.method.toLowerCase()=='post'){
		photos.deletFiles(request.params.folder,request.params.file,(status)=>{;
			response.json({status});
		});
	};
};

/**获取相册封面
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.singleFolder = (request,response,next)=>{
	if(request.params){
		photos.getSingleFolder(request.params.folder,(file,len)=>{
			response.json({file,len});
		});
	}
};

/**获取单个图片
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.getSinglePhoto =  (request,response,next)=>{
	if(request.params){
		let folder = request.params.folder;
		let file = request.params.file;
		photos.getSinglePhoto(folder,file,(width,height)=>{
			response.json({width,height});
		});
	}
};

/**添加相册
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.addFolder = (request,response,next)=>{
	if(request.params){
		let folder = request.params.folder;
		photos.addFolder(folder,(status)=>{
			response.json({status});
		});
	}
};

/**删除相册
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.delFolder = (request,response,next)=>{
	if(request.method.toLowerCase()=='post'){
		photos.delFolder(request.params.folder,(status)=>{;
			response.json({status});
		});
	};
};
/**容错处理
 * @param  {[type]}
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
exports.ERROR = (request,response,next)=>{
	photos.error(400,(statuscode)=>{
		response.status(statuscode).end();
	});
};