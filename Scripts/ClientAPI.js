var urlpath = "http://explorationlab.projectioncore.com/OTCS/cs.exe/api/";
function UserAction(user, pass) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            sessionStorage.setItem('Key',this.responseText);
            window.location.replace("./form.html");
        }else if(this.status == 401){
            swal({
                type: 'error',
                title: 'Opps...',
                text: "Usuario y contraseña errado, intenta de nuevo"
            });
        }else if(this.status == 500){
            swal({
                type: 'error',
                title: 'Opps...',
                text: "Error del servidor, intenta más tarde..."
            });
        }
    };
    xhttp.open("POST", urlpath + "v1/auth", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username="+ user +"&password=" + pass);
}

function GetInfoSelects(node, select) {
    var tokenJson = sessionStorage.getItem("Key");
    var jsonToken = JSON.parse(tokenJson);
    var url= urlpath + 'v1/nodes/' + node + '/output';
    
    switch(select) {
        case 1:
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            statusCode: {
                401:function() { logOut(); }
            },
            success: function(msg) {
                var data = msg.data.trim();
                var arrayTypeDoc = data.split(',');
                $.each(arrayTypeDoc, function( i, val ) {
                    $("#tipoDocuemnto").append( "<option value='" + val + "'>" + val + "</option>" );
                });
            },
            error: function() { 
                swal({
                    type: 'error',
                    title: 'Opps...',
                    text: "Error del servidor, intenta más tarde..."
                });
            },
            beforeSend: setHeader
        });           
        
        break;
        case 2:
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            statusCode: {
                401:function() { logOut(); }
            },
            success: function(msg) {
                var data = msg.data.trim();
                var arrayTypeDoc = data.split(',');
                $.each(arrayTypeDoc, function( i, val ) {
                    $("#area").append( "<option value='" + val + "'>" + val + "</option>" );
                });
            },
            error: function() { 
                swal({
                    type: 'error',
                    title: 'Opps...',
                    text: "Error del servidor, intenta más tarde..."
                });
            },
            beforeSend: setHeader
        });
        break;
        case 3:
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            statusCode: {
                401:function() { logOut(); }
            },
            success: function(msg) {
                var data = msg.data.trim();
                var arrayTypeDoc = data.split(',');
                $.each(arrayTypeDoc, function( i, val ) {
                    $("#tipoTaxo").append( "<option value='" + val + "'>" + val + "</option>" );
                });
            },
            error: function() {
                swal({
                    type: 'error',
                    title: 'Opps...',
                    text: "Error del servidor, intenta más tarde..."
                });
            },
            beforeSend: setHeader
        });
        break;
        default:
        console.log("nodo no contemplado");
    }
    
    function setHeader(xhr) {
        xhr.setRequestHeader('OTCSTICKET', jsonToken.ticket);
    }
}

function GetInfoPerson(tipoDoc, cedula){
    var tokenJson = sessionStorage.getItem("Key");
    var jsonToken = JSON.parse(tokenJson);
    var url= urlpath + 'v1/nodes/155677/output?inputlabel1=' + tipoDoc + '&inputlabel2='+ cedula;
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        statusCode: {
            401:function() { logOut(); }
        },
        success: function(msg) {
            var data = msg.data.trim();
            var dataJson = JSON.parse(data);
            if(dataJson.Name == "ERROR"){
                $('#errorSearch').html("<b>Error:</b> No encontrado");
                $('#errorSearch').show();
                $('#succsessSearch').hide();
                $('#infoSearch').hide();
                $('.dataForm').hide();
            }else if(dataJson.Name == "CERRADO"){
                $('#infoSearch').html("<b>Info:</b> El expediente se encuentra cerrado.");
                $('#infoSearch').show();
                $('#succsessSearch').hide();
                $('#errorSearch').hide();
                $('.dataForm').hide();
            }else{
                $('#succsessSearch').html("<b>" + dataJson.Name + "</b>");
                $('#succsessSearch').show();
                $('#infoSearch').hide();
                $('#errorSearch').hide();
                $('.dataForm').show();
            }
            localStorage.setItem("DataID", dataJson.DataID);
        },
        error: function() { 
            swal({
                type: 'error',
                title: 'Opps...',
                text: "Error del servidor, intenta más tarde..."
            });
        },
        beforeSend: setHeader
    });
    
    function setHeader(xhr) {
        xhr.setRequestHeader('OTCSTICKET', jsonToken.ticket);
    }
}

function GetPathId(){
    var tipoDocumento = $('#tipoTaxo').val();
    var dataIdArea = localStorage.getItem("DataID");
    var tokenJson = sessionStorage.getItem("Key");
    var jsonToken = JSON.parse(tokenJson);
    
    url = urlpath + "v1/nodes/155905/output?inputlabel1=" + tipoDocumento + "&inputlabel2=" + dataIdArea;
    if(tipoDocumento != "Selecciona un Tipo" ){
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            statusCode: {
                401:function() { logOut(); }
            },
            success: function(msg) {
                var data = msg.data.trim();
                var dataPath = JSON.parse(data);
                console.log(dataPath);
                localStorage.setItem("DataIDPath", dataPath.DataID);
            },
            error: function() { 
                swal({
                    type: 'error',
                    title: 'Opps...',
                    text: "Error del servidor, intenta más tarde..."
                });
            },
            beforeSend: setHeader
        });
        
        function setHeader(xhr) {
            xhr.setRequestHeader('OTCSTICKET', jsonToken.ticket);
        }
    }
    
}

function UploadFile(){
    url = urlpath + "v2/nodes";
    var tipoDocumento = $('#tipoTaxo').val();
    var pathID = localStorage.getItem("DataIDPath");
    var tokenJson = sessionStorage.getItem("Key");
    var jsonToken = JSON.parse(tokenJson);
    var datos = new FormData();
    var jdata = [];
    
    $.each($(":file"), function (iif, oif) {
        $.each($(oif)[0].files, function (siif, soif) {
            datos.append("file", soif);
        });
    });
    datos.append("type", 144);
    datos.append("parent_id", pathID);
    datos.append("name", tipoDocumento);
    
    console.log("datos", datos);
    $.ajax({
        url: url,
        data: datos,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        statusCode: {
            401:function() { logOut(); },
            500:function() { 
                swal({
                    type: 'error',
                    title: 'Opps...',
                    text: "Error 500 del servidor: Data:" + JSON.stringify(datos)
                });
                $("#buttonSave").button('reset');
            }
        },
        success: function(msg) {
            swal({
                type: 'success',
                title: 'Perfecto...',
                text: "Documento agregado..."
            });
            console.log(msg);
            var fileID = msg.results.data.properties.id;
            $("#buttonSave").button('reset');
            AddCategory(fileID);
        },
        error: function() { 
            swal({
                type: 'error',
                title: 'Opps...',
                text: "Error del servidor, intenta más tarde..."
            });
        },
        beforeSend: setHeader
    });
    
    function setHeader(xhr) {
        xhr.setRequestHeader('OTCSTICKET', jsonToken.ticket);
    }
}

function AddCategory(DataDI){
    url = urlpath + "v2/nodes/" + DataDI + "/categories";
    var pathID = localStorage.getItem("DataIDPath");
    var tokenJson = sessionStorage.getItem("Key");
    var jsonToken = JSON.parse(tokenJson);
    var category = {
        category_id: 101750,
        '101750_6': $('#area').val(), //Area
        '101750_7': $('#tipoTaxo').val(), //Tipo documental
        '101750_4': $('#fechaDocumento').val()  //Fecha
    };
    
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: category,
        statusCode: {
            401:function() { logOut(); }
        },
        success: function(msg) {
            console.log(msg);
        },
        error: function() { 
            swal({
                type: 'error',
                title: 'Opps...',
                text: "Error del servidor (AddCategory), intenta más tarde..."
            });
        },
        beforeSend: setHeader
    });
    
    function setHeader(xhr) {
        xhr.setRequestHeader('OTCSTICKET', jsonToken.ticket);
    }
}