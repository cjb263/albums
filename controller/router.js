let photos = require('../models/');

module.exports  = {
	//相册首页
	showIndex:(request,response,next)=>{
		photos.getFolders(response,(folders)=>{
			response.render('albums',{folders});
		});
	},
	//获取一个相册里面的图片
	showPhotos:(request,response,next)=>{
		 let folder = request.params.folder;
		 photos.getPhotos(response,folder,(albums)=>{
			response.render('shows',{albums,folder});
		 });
	},
	//上传图片
	uploadPhotos:(request,response,next)=>{
	 let folder = request.params?request.params.folder:'share';
	 if(request.method.toLowerCase()=='post'){
	 	photos.uploadFiles(request,response,'./uploads/'+folder,()=>{
	 		response.redirect('/photos/'+folder);
	 	});
	 	return;
		 };
		 response.render('upload',{folder});
	},
	//上传图片
	uploadPhotos2:(request,response,next)=>{
	 let folder = request.params?request.params.folder:'share';
		 if(request.method.toLowerCase()=='post'){
		 	photos.uploadFiles2(request,response,'./uploads/'+folder,()=>{
		 		response.redirect('/photos/'+folder);
		 	});
		 	return;
		 }
		 response.render('upload',{folder});
	},
	//删除图片
	deletePhotos:(request,response,next)=>{
		if(request.method.toLowerCase()=='post'){
			photos.deletFiles(request.params.folder,request.params.file,(status)=>{;
				response.json({status});
			});
		};
	},
	//获取相册封面
	singleFolder:(request,response,next)=>{
		if(request.params){
			photos.getSingleFolder(request.params.folder,(file,len)=>{
				response.json({file,len});
			});
		}
	},
	//获取图片的尺寸
	getSinglePhoto:(request,response,next)=>{
		if(request.params){
			let folder = request.params.folder;
			let file = request.params.file;
			photos.getSinglePhoto(folder,file,(width,height)=>{
				response.json({width,height});
			});
		}
	},
	//添加相册
	addFolder:(request,response,next)=>{
		if(request.params){
			let folder = request.params.folder;
			photos.addFolder(folder,(status)=>{
				response.json({status});
			});
			}
	},
	//删除相册
	delFolder:(request,response,next)=>{
		if(request.method.toLowerCase()=='post'){
			photos.delFolder(request.params.folder,(status)=>{;
				response.json({status});
			});
		};
	},
	//容错
	ERROR:(request,response,next)=>{
		photos.error(400,(statuscode)=>{
			response.status(statuscode).end();
		});
	}
};