let photos = require('../models/');

//show folders
exports.showIndex = (request,response,next)=>{
	photos.getFolders((folders)=>{
		response.render('albums',{folders});
	});
};

//show albums
exports.showPhotos= (request,response,next)=>{
	 let folder = request.params.folder;
	 photos.getPhotos(folder,(albums)=>{
		response.render('shows',{albums,folder});
	 });
};

//upload photos 采用 formidable 模式
exports.uploadPhotos  = (request,response,next)=>{
	 let folder = request.params?request.params.folder:'share';
	 if(request.method.toLowerCase()=='post'){
	 	photos.uploadFiles(request,'./uploads/'+folder,()=>{
	 		response.redirect('/photos/'+folder);
	 	});
	 	return;
	 };
	 response.render('upload',{folder});
};

//upload photos 采用 multer 模式
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

//delete photos
exports.deletePhotos = (request,response,next)=>{
	if(request.method.toLowerCase()=='post'){
		photos.deletFiles(request.params.folder,request.params.file,(status)=>{;
			response.json({status});
		});
	};
};

// get single first folder imgs 
exports.singleFolder = (request,response,next)=>{
	if(request.params){
		photos.getSingleFolder(request.params.folder,(file,len)=>{
			response.json({file,len});
		});
	}
};

//get single photos
exports.getSinglePhoto =  (request,response,next)=>{
	if(request.params){
		let folder = request.params.folder;
		let file = request.params.file;
		photos.getSinglePhoto(folder,file,(width,height)=>{
			response.json({width,height});
		});
	}
};

//add folder
exports.addFolder = (request,response,next)=>{
	if(request.params){
		let folder = request.params.folder;
		photos.addFolder(folder,(status)=>{
			response.json({status});
		});
	}
};

///folder/del/:folder
exports.delFolder = (request,response,next)=>{
	if(request.method.toLowerCase()=='post'){
		photos.delFolder(request.params.folder,(status)=>{;
			response.json({status});
		});
	};
};