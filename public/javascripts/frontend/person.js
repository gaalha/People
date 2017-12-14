var gridButtons = "";
var gridStatus = "";
var table;

$(document).ready(function(){
	prepareButtons();
	initGrid();
});

$.validator.setDefaults({  
    errorElement: "em",
    errorPlacement: function(error, element) {
      // Add the `help-block` class to the error element
      error.addClass("help-block");

      // Add `has-feedback` class to the parent div.form-group
      // in order to add icons to inputs
      element.parents(".form-group").addClass("has-feedback has-error");

      if(element.prop("type") === "checkbox") {
        error.insertAfter(element.parent("label"));
      } else{
        error.insertAfter(element);
      }

      // Add the span element, if doesn't exists, and apply the icon classes to it.
      if (!element.next("span")[0]) {
        $("<span class='glyphicon glyphicon-remove form-control-feedback'></span>").insertAfter(element);
      }
    },
    success: function(label, element) {
      // Add the span element, if doesn't exists, and apply the icon classes to it.
      if(!$(element).next("span")[0]) {
        $("<span class='glyphicon glyphicon-ok form-control-feedback'></span>").insertAfter($(element));
      }
    },
    highlight: function(element, errorClass, validClass) {
      $(element).parents(".col-sm-5").addClass("has-error").removeClass("has-success");
      $(element).next("span").addClass("glyphicon-remove").removeClass("glyphicon-ok");
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
      $(element).next("span").addClass("glyphicon-ok").removeClass("glyphicon-remove");
    }
});

function prepareButtons(){
	gridStatus = $("#gridStatus").val();
    var bodyButtons = $("#gridButtons").val();
    var tags = $("<div/>");
    tags.append(bodyButtons);

   	$("#btnNew").click(function(){
    	showDialog() 
 	});

    gridButtons = "<center>"+tags.html()+"<center>";
}

function bindButtons(){
    $('#personGrid tbody tr td button').unbind('click').on('click',function(event){
        if(event.preventDefault) event.preventDefault();
        if(event.stopImmediatePropagation) event.stopImmediatePropagation();
        var obj = JSON.parse(Base64.decode($(this).parent().attr("data-row")));
        var action = $(this).attr("data-action");

        if(action=='edit'){ showDialog(obj._id); }
        else if(action=='delete'){ deleteRecord(obj._id); }
    })
}

function drawRowNumbers(selector,table){
    if(typeof(table)=='undefined') return;

    var info = table.page.info();
    var index = info.start + 1;
    $.each($(selector+" tbody tr td:first-child"),function(idx,obj){
        if($(obj).hasClass('dataTables_empty')) return;
        $(obj).addClass('text-center').html(index++);
    });
}

function initGrid(){
    table = $('#personGrid')
        .on('draw.dt',function(e,settings,json,xhr){
            setTimeout(function(){bindButtons();},500);
            drawRowNumbers("#personGrid",table);
        }).DataTable({
   		ajax: "/api/person/getPersonList",
   		aoColumns: [
   			{data: '_id', sortable:false, searchable:false},
   			{data: 'dui'},
   			{data: 'name'},
   			{data: 'age'},
   			{data: 'address'},
   			{
                sortable:false, searchable:false,
                render:function(data,type,row,meta){
                    return gridButtons.replace("{data}",Base64.encode(JSON.stringify(row)));
                }
            }
   		]
    });
    $('#personGrid').removeClass('display').addClass('table table-hover table-bordered table-stripped table-responsive dataTable');
}

function deleteRecord(_id){
    bootbox.confirm("Are you sure you want to delete this registry?", function(result) {
        if(result){
            $.ajax({
                url:"/api/person/deletePerson/" + _id,
                type:'DELETE',
                success:function(data){
                    humane.log(data.message)
                    if(data.success){
                        table.ajax.reload();
                    }
                }
            });
        }
    });
}

function showDialog(_id){
    var isEditing = !(typeof(_id) === "undefined" || _id === 0);

    dialog = bootbox.dialog({
        title: (isEditing ? "Edit" : "New"),
        message: $("#personFormBody").val(),
        className:"modalSmall"
    });   
    startValidation();
    //numbersOnly();

    if(isEditing){
        $("#txtIdHidden").val(_id);
        loadData(_id);
    }
}

function loadData(_id){
    var form = $("#personForm");
    var dui = $("#txtDui");
    var name = $("#txtName");
    var age = $("#txtAge");
    var address = $("#txtAddress")
    $.ajax({
        url: "/api/person/getPersonData/" + _id,
        type:'GET',
        success:function(data){
            console.log(data);
            if(data.success == true){
                dui.val(data.data.dui);
                name.val(data.data.name);
                age.val(data.data.age);
                address.val(data.data.address);
            }
            }});
}

function startValidation(){
    numbersOnly();
    $('#txtDui').keypress(function(event) {
      masking(this.value, this, event);
    });
     $('#personForm').validate({
         rules: {
            txtDui: { required: true, minlength: 10, maxlength:10,},
            txtName: {required:true, minlength: 2, maxlength:140, number: false},
            txtAge: {required:true, min:18, max:100},
            txtAddress:{required:true, minlength: 10, maxlength:120}
         },
         messages: {
            txtDui: { required: '¡Campo obligatorio!' },
            txtName: { required: '¡Campo obligatorio!' },
            txtAge: { required: '¡Campo obligatorio!' },
            txtAddress: { required: '¡Campo obligatorio!' }
         },
         submitHandler: function(form) {
            save();
         }
     });
}

function save(){
    var form = $("#personForm");
    var data = form.serialize();
    $.ajax({
       url: '/api/person/savePerson',
       type: 'POST',
       data:  data,
       success:function(data){
           console.log(data);
           humane.log(data.message);
           if(data.success==true){
               table.ajax.reload();
               dialog.modal('hide');
           }
       }
    });
}

function numbersOnly(){
  $(function () {
    $('#txtDui').keydown(function (e) {
      if (e.shiftKey || e.ctrlKey || e.altKey) {
        e.preventDefault();
      } else {
        var key = e.keyCode;
        if (!((key == 8) || (key == 46) || (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))) {
          e.preventDefault();
          masking();
        }
      }
    });
  });
}

function masking(input,textbox,e) {
  if (input.length == 8) {
    input = input + '-';
    textbox.value = input;
  }
}