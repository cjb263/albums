  //添加相册
  function addFolder(){
      $.alert({
        content: '<input type="text" class="form-control" id="newfolder"/><br/><button onclick="addFolderSubmit()" class="btn btn-success btn-sm">添加</button> (只允许英文)',
        title: '添加相册文件夹',
        cancelButton: false,
        confirmButton: false
    });
  }
  function addFolderSubmit(){
    var newfolder=  $("#newfolder");
    if(newfolder.val()!=''){
      var reg =/^[A-Za-z]+$/g;
      if(reg.test(newfolder.val())){
          $.get('/folder/add/'+newfolder.val(),function(status){
             if(status.status==1){
                var alert = $.alert({
                      content:'添加成功',
                      title: '',
                      confirmButton: false
                   });
              setTimeout(function(){window.location.href='/';},1200);
             }else{
                  var alert = $.alert({
                      content:'文件夹可能已经存在或权限不足',
                      title: '',
                      confirmButton: false
                   });
                setTimeout(function(){alert.close();},1200);
             }
          });
      }else{
        newfolder.focus();
      } 
    }else{
      newfolder.focus();
    }
  }