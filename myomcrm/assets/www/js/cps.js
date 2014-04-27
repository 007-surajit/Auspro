var isDeviceReady = 0;
var db = null;
var logged_in_user_data = new Array();
var last_filled_data_array = new Array();
var filled_data_array_to_upload = new Array();
var is_user_login = 0;
// Wait for Cordova to load

var product21cTranformerModelData = {
  "OSRAM": ["ET-P 60/220-240 gen 1","ET-P 60/220-240 gen 2","ET-Redback 60VA/230-240","HTB 70/220-240V","ET-ZE 60/220-240V","ET-ZL 50/220-240V","HTN 75/230-240V","HTL 105/230- 240V","HTM 150/230V-240V","HTL 225/230-240V","HTM 105/230-240V","HTM 70/230-240V","ET Redback"],
  "Philips": ["Primaline 70 230-240 9137006275","ET-E60 220-240 9137100311","ET-S6 220-240V 9137100305","CERTALINE 105W 913700633991"],
  "Tridonic": ["Possum 60VA"],
  "Tridonic Atco": ["Viper 60VA","Speedy 20-50W","Speedy 20-70W","Speedy 105W"],
  "Actec": ["Mini60","Venus60","Mini105"],
  "Clipsal":["CDL 1E60C"],
  "Gentech":["Pod 60"],
  "Nelson":["Cont-70","MTECougar60"],
  "Ansell":["Atx20/60"],
  "TCI":["PUMA 105 20-105W"],
  "SELF":["KA-GOT 20-60W","SET60T-EL"],
  "ROLUT":["SET105M 35-105W","ET80L(20-80VA)"],
  "AGK":["MZ-ET60"]
};


/*function changeDropdown(select_id) {
	var myselect = $("#"+select_id);
	myselect[0].selectedIndex = 2;
	myselect.selectmenu("refresh");
}*/

function selectDefaultOption(select_id,ddvalue) {
	var myselect = $("#"+select_id);	
	if(myselect[0].length === 2 && myselect[0][0].value === "") {
		if(ddvalue != "") {
			myselect[0].selectedIndex = 1;
		}else{
			myselect[0].selectedIndex = 0;
		}
		myselect.selectmenu("refresh");
	}	
 }
 
 function showHiddenCell(dropdown) {
    if(dropdown.id == "circuittext21c") {
		if(dropdown.value == "Yes") {
			$(dropdown).closest('td').next().children().show();
			$(dropdown).closest('td').next().next().children().show();
		}else {
			$(dropdown).closest('td').next().children().hide();
			$(dropdown).closest('td').next().next().children().hide();
		}
	}
 }

function deviceisready()
{
    //alert('deviceready'+device.cordova);
    isDeviceReady = 1;
  
   window.plugins.barcodeScanner.getLocation(function(position){
   	//alert(position.latitude+' '+position.longitude);
	   localStorage.setItem("latitude",position.latitude);
       localStorage.setItem("longitude",position.longitude);
	}, function(error){	
		//alert(error);
		localStorage.setItem("latitude",'location error');
	    localStorage.setItem("longitude",'location error');
    });
    // window.plugins.barcodeScanner.showLoader('My Text ...');    
    //setTimeout(function(){window.plugins.barcodeScanner.hideLoader()},5000);
    db = window.sqlitePlugin.openDatabase({name: "cps.sqlite"});    
    //alert('ok');    
}


function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
};

function get_loggedin_user_data(callback)
{

    db.transaction(function(tx) {
        tx.executeSql("select * from user_login where is_logged_in='1';", [], function(tx, res) {
        	//alert('Rows :'+res.rows.length);
            if(res.rows.length > 0)
            {
                //console.log(res.rows.item(0).user_id+','+res.rows.item(0).username+','+res.rows.item(0).name+','+res.rows.item(0).last_login+','+res.rows.item(0).password);
                
                //alert('wait');
            	
            	is_user_login = 1;
                logged_in_user_data.user_id = res.rows.item(0).user_id;
                logged_in_user_data.name = res.rows.item(0).username; //res.rows.item(0).name;
                logged_in_user_data.fullname = res.rows.item(0).name;
                logged_in_user_data.username = res.rows.item(0).username;
                logged_in_user_data.password = res.rows.item(0).password;
                
                callback(is_user_login);
                
            }else{
                is_user_login = 0;
                callback(is_user_login);
            }
        });
      });
}


function get_saved_filled_data(id,callback)
{

    db.transaction(function(tx) {
        
        console.log("select * from customer where creator_id='"+logged_in_user_data.user_id+"' and id = '"+id+"';");
        tx.executeSql("select * from customer where creator_id='"+logged_in_user_data.user_id+"' and id = '"+id+"';", [], function(tx, res) {
            if(res.rows.length > 0)
            {
                last_filled_data_array = res.rows.item(0);
                last_filled_data_array.products =  new Array();
                last_filled_data_array.other_products =  new Array();
                tx.executeSql("select * from products where cust_num='"+last_filled_data_array.id+"';", [], function(tx, res) {
                    console.log("result len"+res.rows.length);
                    if(res.rows.length > 0)
                    {
                        for(var n = 0; n < res.rows.length; n++){
                            last_filled_data_array.products.push(res.rows.item(n));
                        }
    
                        
                        //callback(1);
                        
                    }else{
                        callback(1);
                    }
                });
                
                tx.executeSql("select * from other_products where cust_num='"+last_filled_data_array.id+"' and producttype != 'null' AND (productbrand != 'null' OR productbrand != '') AND (productmodel != 'null' OR productmodel != '') ;", [], function(tx, res2) {
                    console.log("result len"+res2.rows.length);
                    if(res2.rows.length > 0)
                    {
                        for(var n = 0; n < res2.rows.length; n++){
                            last_filled_data_array.other_products.push(res2.rows.item(n));
                        }
                        callback(1);
                    }else{
                        callback(1);
                    }
                });
                callback(1);
            }else{
                callback(0);
            }
        });
      });
      

}


function get_filled_data(callback)
{

	//alert('get_filled_data');
    db.transaction(function(tx) {
        tx.executeSql("select * from customer where creator_id='"+logged_in_user_data.user_id+"' and saved = '0' and uploaded = '0' order by create_time desc limit 1;", [], function(tx, res) {
        	
        	//alert('no of rows: '+res.rows.length);
            
        	if(res.rows.length > 0)
            {
                last_filled_data_array = res.rows.item(0);
                last_filled_data_array.products =  new Array();
                last_filled_data_array.other_products =  new Array();
                tx.executeSql("select * from products where cust_num='"+last_filled_data_array.id+"';", [], function(tx, res) {
                    console.log("result len"+res.rows.length);
                    if(res.rows.length > 0)
                    {
                        for(var n = 0; n < res.rows.length; n++){
                            last_filled_data_array.products.push(res.rows.item(n));
                        }
    
                        
                        //callback(1);
                        
                    }else{
                        callback(1);
                    }
                });
                
                tx.executeSql("select * from other_products where cust_num='"+last_filled_data_array.id+"' and producttype != 'null' AND (productbrand != 'null' OR productbrand != '') AND (productmodel != 'null' OR productmodel != '') ;", [], function(tx, res2) {
                    console.log("result len"+res2.rows.length+'133');
                    if(res2.rows.length > 0)
                    {
                        for(var n = 0; n < res2.rows.length; n++){
                            last_filled_data_array.other_products.push(res2.rows.item(n));
                        }
    
                        callback(1);
                    }else{
                        callback(1);
                    }
                });

                callback(1);
                
            }else{
                callback(0);
            }
        });
      });
      

}

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

function get_data_to_upload_count(callback)
{

    db.transaction(function(tx) {
        tx.executeSql("select count(*) as total from customer where creator_id='"+logged_in_user_data.user_id+"' and saved = '1' and uploaded = '0';", [], function(tx, res) {
            if(res.rows.length > 0)
            {
                callback(res.rows.item(0).total);
            }
            
        });
        
    });
    
}


function get_upload_data_images(cust_num, product_id, callback)
{
    db.transaction(function(tx) {
        
        var images =  new Array();
        tx.executeSql("select * from product_images where cust_num='"+cust_num+"' and product_id='"+product_id+"';", [], function(tx, res2) 
            {
                console.log("inside products ");
                
                if(res2.rows.length > 0)
                {
                    asyncLoop(res2.rows.length, function(loop2) {
                        //filled_data_array_to_upload.product_images.push(res2.rows.item(loop2.iteration()));
                        
                        
                        //console.log(res2.rows.item(loop2.iteration()).image);
                         
                         
                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                            //console.log("aaa");
                            fileSystem.root.getDirectory("photos", {create: true, exclusive: false}, function(dir) { 
                            
                                //console.log("------file://localhost"+dir.fullPath+"/");
                                dir.getFile(res2.rows.item(loop2.iteration()).image, null, function(fileEntry) {
                                    //console.log("abcd");
                                    fileEntry.file(function(file) {
                                        //console.log("2");
                                        var reader = new FileReader();
                                        reader.onloadend = function(evt) {
                                            console.log("Read complete!");
                                            images.push(evt.target.result);
                                            loop2.next();
                                        };
                                        reader.readAsDataURL(file);
                                    },  function(fail){ console.log("fail reading file");  loop2.next();});
                                },  function(fail){ console.log("fail file entry");  loop2.next();});
                            },  function(fail){ console.log("fail directory file");  loop2.next();});
                        },  function(fail){ console.log("fail system"); loop2.next(); })
                        
                        
                        },function(){ console.log("loop of iamges finished"); callback(images); }
                         
                         
                         
                    );                                  
                            
                        
                    //callback(1);
                    
                }else{
                    
                    console.log("inside product next loop");
                    callback(images);
                }
            
                
            })
                            
    });
}

function get_upload_data_other_images(cust_num, product_id, callback)
{
    db.transaction(function(tx) {
        var images =  new Array();
        tx.executeSql("select * from other_product_images where cust_num='"+cust_num+"' and product_id='"+product_id+"';", [], function(tx, res2) 
            {
                console.log("inside products ");
                if(res2.rows.length > 0)
                {
                    asyncLoop(res2.rows.length, function(loop2) {
                        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                            fileSystem.root.getDirectory("photos", {create: true, exclusive: false}, function(dir) { 
                                dir.getFile(res2.rows.item(loop2.iteration()).image, null, function(fileEntry) {
                                    fileEntry.file(function(file) {
                                        var reader = new FileReader();
                                        reader.onloadend = function(evt) {
                                            console.log("Read complete!");
                                            images.push(evt.target.result);
                                            loop2.next();
                                        };
                                        reader.readAsDataURL(file);
                                    },  function(fail){ console.log("fail reading file");  loop2.next();});
                                },  function(fail){ console.log("fail file entry");  loop2.next();});
                            },  function(fail){ console.log("fail directory file");  loop2.next();});
                        },  function(fail){ console.log("fail system"); loop2.next(); })
                        },function(){ console.log("loop of iamges finished"); callback(images); }
                    );                                  
                }else{
                    console.log("inside product next loop");
                    callback(images);
                }
            })
    });
}

/*function get_data_to_upload(callback)
{

    db.transaction(function(tx) {
        tx.executeSql("select * from customer where creator_id='"+logged_in_user_data.user_id+"' and saved = '1' and uploaded = '0' order by create_time asc limit 1;", [], function(tx, resF) {
            if(resF.rows.length > 0)
            {
                filled_data_array_to_upload = resF.rows.item(0);
                filled_data_array_to_upload.currentUploadingTime =  Math.round(new Date().getTime() / 1000);
                filled_data_array_to_upload.products =  new Array();
                filled_data_array_to_upload.other_products =  new Array();
                tx.executeSql("select * from products where cust_num='"+filled_data_array_to_upload.id+"' and productserialnum != '';", [], function(tx, res) {
                    
                    if(res.rows.length > 0)
                    {
                        
                        asyncLoop(res.rows.length, function(loop) {
                            console.log("before pro");
                            console.log("Total products"+res.rows.length+" loop is "+loop.iteration());
                            filled_data_array_to_upload.products.push(res.rows.item(loop.iteration()));
                            
                            console.log("after push  pro");
                            console.log(res.rows.item(loop.iteration()).id);
                            console.log("select * from product_images where cust_num='"+filled_data_array_to_upload.id+"' and product_id='"+res.rows.item(loop.iteration()).id+"';");
                            console.log("after aaa  pro");
                            
                                get_upload_data_images(filled_data_array_to_upload.id, res.rows.item(loop.iteration()).id, function(images){
                                    console.log("in get data");
                                    filled_data_array_to_upload.products[filled_data_array_to_upload.products.length-1].images = images;
                                    loop.next();
                                });
                            }, 
                            function(){console.log("outside for");//callback(1);
                        }
                        );
                            
                    }else{
                        //callback(0);
                    }
                });

                
                //Other Products
                tx.executeSql("select * from other_products where cust_num='"+filled_data_array_to_upload.id+"' and producttype != 'null';", [], function(tx, res2) {
                    if(res2.rows.length > 0)
                    {                        
                        asyncLoop(res2.rows.length, function(loop) {
                            filled_data_array_to_upload.other_products.push(res2.rows.item(loop.iteration()));
                            get_upload_data_other_images(filled_data_array_to_upload.id, res2.rows.item(loop.iteration()).id, function(images){
                                filled_data_array_to_upload.other_products[filled_data_array_to_upload.other_products.length-1].images = images;
                                loop.next();
                            });
                        }, function() {
                            console.log("outside for");callback(1);
                        });
                            
                    }else{
                        callback(0);
                    }
                });
                callback(1);
                
            }else{
                callback(0);
            }
        });
      });
      

}*/

function get_data_to_upload(callback)
{

    db.transaction(function(tx) {
        tx.executeSql("select * from customer where creator_id='"+logged_in_user_data.user_id+"' and saved = '1' and uploaded = '0' order by create_time asc limit 1;", [], function(tx, resF) {
            if(resF.rows.length > 0)
            {
                filled_data_array_to_upload = resF.rows.item(0);
                filled_data_array_to_upload.currentUploadingTime =  Math.round(new Date().getTime() / 1000);
                filled_data_array_to_upload.products =  new Array();
                filled_data_array_to_upload.other_products =  new Array();
                tx.executeSql("select * from products where cust_num='"+filled_data_array_to_upload.id+"' and productserialnum != '';", [], function(tx, res) {
                    
                    if(res.rows.length > 0)
                    {
                        asyncLoop(res.rows.length, function(loop) {
                            console.log("before pro");
                            console.log("Total products"+res.rows.length+" loop is "+loop.iteration());
                            filled_data_array_to_upload.products.push(res.rows.item(loop.iteration()));
                            
                            console.log("after push  pro");
                            console.log(res.rows.item(loop.iteration()).id);
                            console.log("select * from product_images where cust_num='"+filled_data_array_to_upload.id+"' and product_id='"+res.rows.item(loop.iteration()).id+"';");
                            console.log("after aaa  pro");
                            
                                get_upload_data_images(filled_data_array_to_upload.id, res.rows.item(loop.iteration()).id, function(images){
                                    console.log("in get data");
                                    filled_data_array_to_upload.products[filled_data_array_to_upload.products.length-1].images = images;
                                    loop.next();
                                });
                            }, 
                            function(){console.log("outside for");
                            
                                //Other Products
                                console.log("select * from other_products where cust_num='"+filled_data_array_to_upload.id+"' and producttype != 'null';");
                                db.transaction(function(txop) {
                                    txop.executeSql("select * from other_products where cust_num='"+filled_data_array_to_upload.id+"' and producttype != 'null';", [], function(tx, res2) {
                                        console.log('otherproducts1');
                                        if(res2.rows.length > 0)
                                        {
                                            console.log('otherproducts2'); 
                                            asyncLoop(res2.rows.length, function(loop2) {
                                                filled_data_array_to_upload.other_products.push(res2.rows.item(loop2.iteration()));
                                                get_upload_data_other_images(filled_data_array_to_upload.id, res2.rows.item(loop2.iteration()).id, function(images){
                                                    filled_data_array_to_upload.other_products[filled_data_array_to_upload.other_products.length-1].images = images;
                                                    loop2.next();
                                                });
                                            }, function() {
                                                console.log("outside for");callback(1);
                                            });
                                                
                                        }else{
                                            callback(1);
                                        }
                                    });
                                });
                                //callback(1);
                            }
                        );
                            
                    }else{
                        console.log('iaminelsecondition');
                        //Other Products
                        tx.executeSql("select * from other_products where cust_num='"+filled_data_array_to_upload.id+"' and producttype != 'null';", [], function(tx, res2) {
                            if(res2.rows.length > 0)
                            {          
                                asyncLoop(res2.rows.length, function(loop2) {
                                    filled_data_array_to_upload.other_products.push(res2.rows.item(loop2.iteration()));
                                    get_upload_data_other_images(filled_data_array_to_upload.id, res2.rows.item(loop2.iteration()).id, function(images){
                                        filled_data_array_to_upload.other_products[filled_data_array_to_upload.other_products.length-1].images = images;
                                        loop2.next();
                                    });
                                }, function() {
                                    console.log("outside for");callback(1);
                                });
                                    
                            }else{
                                callback(1);
                            }
                        });
                        //callback(0);
                    }
                });

            }else{
                callback(0);
            }
        });
      });
      

}

function finish_uploading(cust_id, ticketno, callback)
{
    db.transaction(function(tx) {
        tx.executeSql("update customer SET uploaded='"+ticketno+"', saved = 1 WHERE id='"+cust_id+"';", [], function(tx, res) {
                callback(1);
            }, function(e) {
                      console.log("ERROR: " + e.message);
                callback(0);
        });
    });
    
}

function get_local_events(callback)
{
    var localEvents = new Array();
    db.transaction(function(tx) {
        //console.log("select * from customer where creator_id='"+logged_in_user_data.user_id+"' and saved = '1' and uploaded = '0' order by create_time desc;");
        tx.executeSql("select * from customer where creator_id='"+logged_in_user_data.user_id+"' and saved = '1' order by create_time desc limit 17;", [], function(tx, res) {
            if(res.rows.length > 0)
            {
                for(var n = 0; n < res.rows.length; n++){
                    localEvents.push(res.rows.item(n));
                }
                callback(1, localEvents);
                
            }else{
                callback(0, []);
            }
        });
      });
      

}
function callAnothePage(page)
{
    window.location = page;
}
             
// Cordova is ready

function get_users_count(callback)
{
    
    db.transaction(function(tx) {

        tx.executeSql("select * from user_login;", [], function(tx, res) {
            
            callback(res.rows.length);
        });
      });
}
function checkUserInfo(username, password, callback)
{

    db.transaction(function(tx) {
        tx.executeSql("select * from user_login where username='"+username+"' and password='"+password+"';", [], function(tx, res) {
            if(res.rows.length > 0)
            {
                
                login_user(res.rows.item(0).user_id, function(res){
                    
                    
                    callback(1);
                });
                
            }else{
                
                callback(0);
            }
            
            
        });
      });
      

}

function update_user(user_id, name, username, password)
{
    console.log("data adrrrded");
    var result;
    tx.executeSql("update user_login SET user_id='"+user_id+"', name='"+name+"', username='"+username+"', password='"+password+"', is_logged_in='0' WHERE user_id='"+user_id+"';", [], function(tx, res) {
                  
            result = 1;
        }, function(e) {
                  console.log("ERROR: " + e.message);
            result = 0;
    });
    
    return result;
}

function add_user(data, callback)
{
    var sqlQuery = "INSERT INTO 'user_login' ";
     db.transaction(function(tx) {
        
        console.log("transactino init");
        //tx.execute("BEGIN TRANSACTION");
        console.log("transactino beggin");
        
        var total = data.length;
        var dataCount = 1;
        
        $.each(data, function(index, value) {
            //console.log("transactino eve");
            
            //var sqlQuery = "INSERT INTO user_login (user_id, name, username, password, is_logged_in) VALUES ('"+value.id+"','"+value.firstname+" "+value.lastname+"','"+value.username+"','"+value.password+"','0')";
            
            //"UNION SELECT 'data3', 'data4' UNION SELECT 'data7', 'data8'";
            if(dataCount == 1)
            {
                sqlQuery = sqlQuery+"SELECT '0' AS 'is_logged_in', '"+value.firstname+" "+value.lastname+"' AS 'name','"+value.id+"' AS 'user_id',  '"+value.username+"' AS 'username', '"+value.password+"' AS 'password', '"+Math.round(new Date().getTime() / 1000)+"' 'last_login'"; 
            }else{
                sqlQuery = sqlQuery+" UNION SELECT '0', '"+value.firstname+" "+value.lastname+"' ,'"+value.id+"' ,  '"+value.username+"' , '"+value.password+"'  , '"+Math.round(new Date().getTime() / 1000)+"' 'last_login'"; 
            }
            dataCount++;
            
        });
        
        //INSERT INTO 'user_login' SELECT '0' AS 'is_logged_in','Romil Benoit' AS 'name', '1' AS 'user_id',  'demo' AS 'username', '123' AS 'password', '0' AS 'last_login' UNION SELECT '0',  'Inam Abbas', '2' , 'inam' , 'abbas'  , '0'
        
          console.log("sql q"+sqlQuery);
            tx.executeSql(sqlQuery, [], function(tx, res) {
                          
                    callback(1);
                }, function(e) {
                          console.log("ERROR: " + e.message);
                    callback(0);
            });
        /*tx.execute("COMMIT TRANSACTION", [], function(tx, res) {
            
            console.log("transactino committed"); 
            callback(1);
        }, function(e) {
                  
                  console.log("ERROR: " + e.message);
            callback(0);
        });*/
    });
    
    /*
    var result;
    
    console.log("data aeeeedded");
    
    tx.executeSql("INSERT INTO user_login (user_id, name, username, password, is_logged_in) VALUES (?,?,?,?,?)", [user_id, name, username, password,0], function(tx, res) {
                  console.log("data added");
            callback(1);
        }, function(e) {
                  
                  console.log("ERROR: " + e.message);
            callback(0);
    });
    */
    
}

function save_uploaded_images(cust_num, product_num, data, callback)
{
    var sqlQuery = "INSERT INTO 'product_images' ";
     db.transaction(function(tx) {
        
        var total = data.length;
        var dataCount = 1;
        
        if(total > 0)
        {
            $.each(data, function(index, value) {
                
                if(dataCount == 1)
                {
                    sqlQuery = sqlQuery+"SELECT NULL as 'id', '"+cust_num+"' AS 'cust_num','"+product_num+"' AS 'product_num',  '"+value+"' AS 'image'"; 
                }else{
                    sqlQuery = sqlQuery+" UNION SELECT NULL as 'id', '"+cust_num+"' AS 'cust_num','"+product_num+"' AS 'product_num',  '"+value+"' AS 'image'"; 
                    
                }
                dataCount++;
                
            });
            
              console.log("sql q"+sqlQuery);
                tx.executeSql(sqlQuery, [], function(tx, res) {
                              
                        callback(1);
                    }, function(e) {
                              console.log("ERROR: " + e.message);
                        callback(0);
                });
        }else{
            
            callback(1);
        }
    });
    
    
}

function save_uploaded_other_images(cust_num, product_num, data, callback)
{
    var sqlQuery = "INSERT INTO 'other_product_images' ";
     db.transaction(function(tx) {
        var total = data.length;
        var dataCount = 1;
        if(total > 0)
        {
            $.each(data, function(index, value) {
                if(dataCount == 1)
                {
                    sqlQuery = sqlQuery+"SELECT NULL as 'id', '"+cust_num+"' AS 'cust_num','"+product_num+"' AS 'product_num',  '"+value+"' AS 'image'"; 
                }else{
                    sqlQuery = sqlQuery+" UNION SELECT NULL as 'id', '"+cust_num+"' AS 'cust_num','"+product_num+"' AS 'product_num',  '"+value+"' AS 'image'"; 
                }
                dataCount++;
            });
              console.log("sql q"+sqlQuery);
                tx.executeSql(sqlQuery, [], function(tx, res) {
                        callback(1);
                    }, function(e) {
                              console.log("ERROR: " + e.message);
                        callback(0);
                });
        }else{
            callback(1);
        }
    });
}

function delete_users(callback)
{

    console.log("data delete");
    
    db.transaction(function(tx) {
        tx.executeSql("select * from user_login;", [], function(tx, res) {
            if(res.rows.length > 0)
            {
                console.log('in len check');
                tx.executeSql("DELETE from user_login where 1=1;", [], function(tx, res) {
                  console.log("data deleted");
                        callback(1);
                    }, function(e) {
                              
                              console.log("ERROR: " + e.message);
                        return callback(0);
                });
                
            }else{
                console.log('in return ');
                callback(1);
            }
            
            
        });
      });
      
    
    
    
}

function login_user(user_id, callback)
{
    db.transaction(function(tx) {
        tx.executeSql("update user_login SET is_logged_in='1' WHERE user_id='"+user_id+"';", [], function(tx, res) {
                callback(1);
            }, function(e) {
                      console.log("ERROR: " + e.message);
                callback(0);
        });
    });
    
}
function logout_user(callback)
{
    
    db.transaction(function(tx) {
        tx.executeSql("update user_login SET is_logged_in='0';", [], function(tx, res) {
                logged_in_user_data = new Array();
                is_user_login = 0;
                callback(1);
            }, function(e) {
                console.log("ERROR: " + e.message);
                callback(0);
        });
    });
}

function submitLocalForm(callback)
{
    
    db.transaction(function(tx) {
        tx.executeSql("update customer SET saved='1' WHERE id='"+last_filled_data_array.id+"';", [], function(tx, res) {
                
                callback(1);
            }, function(e) {
                console.log("ERROR: " + e.message);
                callback(0);
        });
    });
}

function getEvents()
{
    console.log("in get events");
    var resultentHTML = '<table width="100%"> <tr> <th> S.No</th> <th> Event Date </th> <th> Event Name </th> <th> Event Attendees </th> </tr>'
    var url = apiURL+"getEvent/"+logged_in_user_data.user_id;
    var eventsCount = 0;
            x$.data = {};
            
            x$("#loginBtn").xhr(url,{ error: function(){alert("failed"+this.responseText)},
                                            callback: function(){
                                                var jsonResponse = eval("("+this.responseText+")");
                                                
                                                console.log("response text "+jsonResponse);
                                                $.each(jsonResponse.events, function(index, value) {
                                                    console.log("in for each"+ value.event_name);
                                                    eventsCount++;
                                                    resultentHTML = resultentHTML+'<tr><td>'+eventsCount+'</td><td>'+value.event_name+'</td><td>'+Date(value.start_datetime)+'</td><td>'+value.attendees+'</td></tr>';
                                                });
                                                
                                                resultentHTML += '</table>';
                                               console.log(resultentHTML);
                                                   return resultentHTML;
                                            }
           });//end of xhr*/
           
            
}


function checkdb() {

  db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS test_table');
    tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

    // demonstrate PRAGMA:
    db.executePragmaStatement("pragma table_info (user_login);", function(res) {
      console.log("PRAGMA res: " + JSON.stringify(res));
    });

    tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
      console.log("insertId: " + res.insertId + " -- probably 1");
      console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

      db.transaction(function(tx) {
        tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
          console.log("res.rows.length: " + res.rows.length + " -- should be 1");
          console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
        });
      });

    }, function(e) {
      console.log("ERROR: " + e.message);
    });
    
    
    
    
    tx.executeSql("INSERT INTO user_login (username, password, last_login) VALUES (?,?,?)", ["2222", "3232", 123], function(tx, res) {
      console.log("222 insertId: " + res.insertId + " -- probably 1");
      console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

      db.transaction(function(tx) {
        tx.executeSql("select count(id) as cnt from user_login;", [], function(tx, res) {
          console.log("res.rows.length: " + res.rows.length + " -- should be 1");
          console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
        });
      });

    }, function(e) {
      console.log("222 ERROR: " + e.message);
    });
    
    
  });
}

$('#checklistPage').live('pageshow', function(event){	  
  
    var emptySigData;
   	 
   //syntax highlighter
   
   var installerSignature = $("#installerSignature");
   var customerSignature = $("#customerSignature"); 
   $("#installerSignature").html('');
   $("#customerSignature").html('');   
      
   //if($('#checklistPage').find('#installerSignature').length == 0){
		$("#installerSignature").jSignature({'width': 700, 'height': 200 });
   //}else{
		$("#installerSignature").jSignature("clear");
		
   //}
   
   //if($('#checklistPage').find('#customerSignature').length == 0){
		$("#customerSignature").jSignature({'width': 700, 'height': 200 });
   //}else{
		$("#customerSignature").jSignature("clear");		
   //}
   
    emptySigData = $("#customerSignature").jSignature("getData");
   
    fileSys.root.getFile("dot1.png", null, function(fileEntry){
       console.log("333333");
           fileEntry.file(function(file){
                   console.log("sdfsd");
                   var reader = new FileReader();
                   reader.onloadend = function(evt) {
       console.log("read success");
       console.log("data:" + evt.target.result);
       installerSignature.jSignature("setData",  evt.target.result) 
   };
   
                   reader.readAsText(file);
                   
                   ;
               }, function(fail){
                   console.log("----sd");
           });
           
       }, function(fail){
           
           console.log("fdfdfd");
             
     });
     
     $("#installation_type a").click(function(index,element){
  		
     	var customerSignature =  $("#customerSignature").jSignature("getData");
     	var installerSignature = $("#installerSignature").jSignature("getData");
     	if(installerSignature == emptySigData) { alert('Installer signature required.'); }
     	else if(customerSignature == emptySigData) { alert('Customer signature required.'); }
      	else {       		
      		
      		if($("#agreeContainer .ui-radio:first label").hasClass('ui-btn-active')) {      		
       		
       		var is_checked = false;
       		$('fieldset').each(function(index){
       			
       			if(index > 0) {

       				if (!$(this).find(".ui-radio label").hasClass('ui-btn-active')) {
       					is_checked = false;
       					console.log('index '+index);
       					return false;
       				}
       				else {
       					is_checked = true;
       				}        				
       			}
       		});
       		
       		if(!is_checked) {
       			alert('All checklist need to be checked');
       		}else{       			
       			//$.mobile.showPageLoadingMsg();
       			var checklistData = {};
       			$("input[name^=radio-view]:checked").each(function(index,element){
          			//alert($(this).val());
       				checklistData['option'+(index+1)] = $(this).val();
          		});
       			localStorage.setItem("checklist_data",JSON.stringify(checklistData));
       			showLoader();
       			
       			if($(this).text() == 'Residential') {
           			
           			$.mobile.changePage( "custom-form-residential.html", { transition: "slide"} );
           			
           		}else if($(this).text() == 'Commercial') {
           			
           			$.mobile.changePage( "custom-form-commercial.html", { transition: "slide"} );
           		}        			
       		}        		        		
       	}else{
       		
       		alert('First check need to have Yes selected to proceed');
       	}
      	}
      	
      });
     
     hideLoader();
     
   });

function showLoader() {
	
	window.plugins.barcodeScanner.showLoader("Loading Please wait...");
}

function hideLoader() {
	
	window.plugins.barcodeScanner.hideLoader();
}
     
 function clearSignature(sigid)
 {
	 console.log(sigid);
	 var sig = $("#"+sigid);
	 //sig.jSignature("setData",  emptySigData);
	 sig.jSignature('clear');
	 console.log('in clog');
 }
 
 $('#customFormPage').live('pagebeforeshow', function(event){
 
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	
	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd;} 
	if(mm<10){mm='0'+mm;} 
	today = mm+'/'+dd+'/'+yyyy;
	$('.todaydate').html(today);
		
	get_loggedin_user_data(function (response) {
	
	    console.log('surajit ' + response);
	    if (response == 1) {
	       $('.loggedin_user_name').html(logged_in_user_data.name);
	
	       console.log('in detail');
	       console.log(window.localStorage.getItem('customerImagedata'));
	    }
	 });
 });
 
 $('#customFormPage').live('pageshow', function(event){

 	 $("#dcl1").hide();
     $("#dcla").hide();
     $("#dcl2").hide();
     $("#dclb").hide();
     $("#dcl3").hide();
     $("#dclc").hide();
     $("#dcl4").hide();
     $("#dcld").hide();
     $("#measures21d").hide();
     $("#outputihd").hide();
     $("#measures21a").hide();
     $("#measures21c").hide();
     //syntax highlighter
     
     var installerSignature = $("#installerSignature");
     var customerSignature = $("#customerSignature");
     $("#installerSignature").html('');
     $("#customerSignature").html('');
     
     
     installerSignature.jSignature({'width': 700, 'height': 200 });
     installerSignature.jSignature("clear");
     
     customerSignature.jSignature({'width': 700, 'height': 200 });
     customerSignature.jSignature("clear");
     
     
     fileSys.root.getFile("dot1.png", null, function(fileEntry){
     console.log("333333");
         fileEntry.file(function(file){
                 console.log("sdfsd");
                 var reader = new FileReader();
                 reader.onloadend = function(evt) {
     console.log("read success");
     console.log("data:" + evt.target.result);
     installerSignature.jSignature("setData",  evt.target.result) 
    };
 
                 reader.readAsText(file);
                 
                 ;
             }, function(fail){
                 console.log("----sd");
         });
         
     }, function(fail){
         
         console.log("fdfdfd");
         
      });
     
     hideLoader();
    
});

 $('#customFormPage').live('pagehide', function(event, ui){
     console.log('in hide func customFormPage'+removePage); 
     
     if(removePage == 1)
     {
         $(this).remove();
     }
           
 });	
 
 function hideSections() {
	/*  Hide sections by checking whether declaration is shown or not */					
		if(!$("#dclli1").is(":visible"))  {
			$(".lighting_lamps").hide(); // Hide Lighting Lamps section					
		}
		
		if(!$("#dclws1").is(":visible"))  {
			//$(".weather_seals_section").hide(); // Hide weather seals section					
		}
		
		if(!$("#dclspc1").is(":visible"))  {
			$(".standard_power_controllers").hide(); // Hide Lighting Lamps section					
		}	
	/*  Hide sections by checking whether declaration is shown or not */
 }
 
 $('#reportPage').live('pageshow', function(event){
	hideSections();
 });
 
 $('#staticReportPage').live('pagehide', function(event, ui){
     $(this).remove();
 });
 

 $('#staticReportPage').live('pageshow', function(event){	 
	 hideSections(); 
 });
 
 $('#staticReportPage').live('pagebeforeshow', function(event){ 

     var today = new Date();
     var dd = today.getDate();
     var mm = today.getMonth()+1; //January is 0!

     var yyyy = today.getFullYear();
     if(dd<10){dd='0'+dd;} 
     if(mm<10){mm='0'+mm;} 
     today = dd+'/'+mm+'/'+yyyy;
     $('#consumer_date').html(today);
     $('#installer_date').html(today);
             
     get_loggedin_user_data(function(response) {
		 var query = document.URL.split("?")[1];			
         var id = query.replace("id=","");                                   
         if(response == 1)
         {
             $('#loggedin_user_name5').html(logged_in_user_data.name);
             $('#installerNameDiv').html(logged_in_user_data.name);
             $('#installerFullNameDiv').html(logged_in_user_data.fullname);                
         }
         
         get_saved_filled_data(id,function(response) {
                                             
             //console.log(response);
             if(response == 1)
             {
                 var previous_spc = "";
                 var previous_spc_txt = "";
                 if(last_filled_data_array.previous_spc != '')
                 {
                     previous_spc = 'Y';
                     previous_spc_txt = last_filled_data_array.previous_spc;
                 }else{
                     
                     previous_spc = 'N';
                 }
                 
                 $("#d_first_name").html(last_filled_data_array.first_name);
                 $("#d_last_name").html(last_filled_data_array.last_name);
                 $("#d_unit_num").html(last_filled_data_array.unit_num);
                 $("#d_street_num").html(last_filled_data_array.street_num);
                 $("#d_street_name").html(last_filled_data_array.street_name);
                 $("#d_street_type").html(last_filled_data_array.street_type);
                 $("#d_town").html(last_filled_data_array.town);
                 
                 $("#d_state").html(last_filled_data_array.state);
                 $("#d_postcode").html(last_filled_data_array.postcode);
                 $("#d_len_of_time").html(last_filled_data_array.len_of_time);
                 $("#d_duration").html(last_filled_data_array.duration);
                 $("#d_tenant_or_owner").html(last_filled_data_array.tenant_or_owner);
                 $("#d_alt_num").html(last_filled_data_array.alt_num);
                 
                 if(last_filled_data_array.dob != '')
                 {
                     $("#d_dob").html(last_filled_data_array.dob);
                 }
                 
                 if(last_filled_data_array.postal_address != '') {
                 	$("#postal_address").html(last_filled_data_array.postal_address);                    	
                 }
					
                 $("#d_cust_email").html(last_filled_data_array.cust_email);
                 $("#d_previous_spc").html(previous_spc);
                 $("#d_phone_num").html(last_filled_data_array.phone_num);
                 $("#cust_sig").attr('src', last_filled_data_array.customer_signature);
                 $("#cust_sig2").attr('src', last_filled_data_array.customer_signature);
                 $("#inst_sig").attr('src', last_filled_data_array.installer_signature);
                 
                 var datetimemilliseconds = parseInt(last_filled_data_array.create_time)*1000;
                 var installationDateObj = new Date(datetimemilliseconds);
                 var dateFormat = installationDateObj.getDate()+"-"+(installationDateObj.getMonth()+1)+"-"+installationDateObj.getFullYear();
                 $("#installation_date").html(dateFormat);
                 $("#installation_date2").html(dateFormat);
                 

                 
                 if(last_filled_data_array.add_spc_reason.length > 10)
                 {
                     last_filled_data_array.add_spc_reason = last_filled_data_array.add_spc_reason.substr(0,10)+"...";
                 }
                 
                 if(previous_spc_txt.length > 10)
                 {
                     previous_spc_txt = previous_spc_txt.substr(0,10)+"...";
                 }
                 
                 $("#d_previous_spc_text").html(previous_spc_txt);
                 $("#d_add_spc_reason").html(last_filled_data_array.add_spc_reason);
                 
                 var productsCount = 1;
                 $.each(last_filled_data_array.products, function(index, value) {
                     
                     if(productsCount == 1)
                     {
                         $("#totalspc").html(last_filled_data_array.num_spc_installed);
                         $("#brandname").html(value.productbrand);
                         $("#modelnum").html(value.productmodel);
                     }
                     
                     if(value.product_num <= last_filled_data_array.num_spc_installed)
                     {
                         $("#d_productserialnum"+value.product_num).html(value.productserialnum);
                         $("#d_productroomtype"+value.product_num).html(value.productroomtype);
                         
                         var productsselectedcount = 0;
                         
                         if(value.applicationa != '-' && value.applicationa != ''){ productsselectedcount++; }
                         if(value.applicationb != '-' && value.applicationb != ''){ productsselectedcount++; }
                         if(value.applicationc != '-' && value.applicationc != ''){ productsselectedcount++; }
                         if(value.applicationd != '-' && value.applicationd != ''){ productsselectedcount++; }
                         
                         $("#d_controlappliences"+value.product_num).html(productsselectedcount);                            
                         if(productsselectedcount > 0)
                         {
                             $('#dclspc1').show();
                             $('#dclspc2').show();
                             $('#dcl5').show();
                             $('#dcle').show();
                         }                            
                     }
                     
                     productsCount++;
                 });

                 var other_productsCount = 1;
                 $.each(last_filled_data_array.other_products, function(index, value) {
                     var prdtypeid = value.producttype.replace(" ", "-");
						
						
						
						$("#tr"+prdtypeid).show();
                     $("#tr"+prdtypeid+"1").show();
                     $("#section_name"+prdtypeid).html(value.producttype);
                     $("#product_model"+prdtypeid).html(value.productmodel);
                     $("#product_brand"+prdtypeid).html(value.productbrand);
                     $("#measures"+prdtypeid).html(value.measures);
						
						// check duplicate justification text
                     if(value.djcheck == 1) {
                     	//$("#before_justification_area").before('<tr><td bgcolor="#CCCCCC" colspan="36">'+value.measures+'</td></tr>');
                     	$("#before_justification_area").before(value.measures+'<br/>');
                     }
						
                     $("#sealed"+prdtypeid).html(value.sealed);
                     $("#output"+prdtypeid).html(value.output);
                     $("#lighting"+prdtypeid).html(value.lightting);
                     $("#manufacturer"+prdtypeid).html(value.manufacturer);
                     $("#lamps"+prdtypeid).html(value.numberoflamps);
                     if(prdtypeid == 'IHD')
                     {
                         $('#dclihd1').show();
                         $('#dclihd2').show();
                         $('#dcl6').show();
                         $('#dclf').show();
                     } else if(prdtypeid == 'Door-Seals') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == 'Chimney-Baloons') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == '21A') {
                         $('#dclli1').show();
                         $('#dclli2').show();
                         $('#dcl8').show();
                         $('#dclh').show();
                     } else if(prdtypeid == '21C-240V') {
                         $('#dclli1').show();
                         $('#dclli2').show();
                         $('#dcl8').show();
                         $('#dclh').show();
							
							/*  New Block */
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21CNetPrice").text('Reduced Price');
                         }
                         
                         if(value.circuittext == "Yes") {
                         	$("#circuitTextDimmable").text("Yes "+value.dimmableCircuitLampInstallations);
                         }
                         
                         if(value.halogen_downlights_replaced_check == 1) {
                         	$("#halogen_check").text("Yes");
                         }else{
                         	$("#halogen_check").text("No");
                         }
                                                   
                         $("#numberOfLamps21C").text(value.numberoflamps);
                         
                         $("#transformerType").text(value.installedlamps);                            
                         
                         $("#transformerModel").text(value.installedlamps2);
                         
                         $("#transformer_name").text(value.productbrand21cTransformerName);
                         
                         $("#transformer_model").text(value.productbrand21cTransformerModel);
                         
                         $("#electrical_safety_no").text(value.productbrand21cElectricalSafetyNo);
							
							/*  New Block */
                     } else if(prdtypeid == '21C-12V') {
                         $('#dclli1').show();
                         $('#dclli2').show();
                         $('#dcl8').show();
                         $('#dclh').show();
							/*  New Block */
							
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21DNetPrice").text('Reduced Price');
                         }
                         
                         $("#numberOfLamps21D").text(value.numberoflamps);
                         
                         $("#above_installation").text(value.above_installation);
							
							/*  New Block */
                     } else if(prdtypeid == 'A2') {
                         $("#productbrand21a2g").html('/'+value.productbrand);
                         $("#productmodel21a2g").html('/'+value.productmodel);
                         $("#output21a2g").html('/'+value.output);
                         $("#lighting21a2g").html('/'+value.lightting);
                         $("#manufacturer21a2g").html('/'+value.manufacturer);
                         $("#numberoflamps21a2g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A3') {
                         $("#productbrand21a3g").html('/'+value.productbrand);
                         $("#productmodel21a3g").html('/'+value.productmodel);
                         $("#output21a3g").html('/'+value.output);
                         $("#lighting21a3g").html('/'+value.lightting);
                         $("#manufacturer21a3g").html('/'+value.manufacturer);
                         $("#numberoflamps21a3g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A4') {
                         $("#productbrand21a4g").html('/'+value.productbrand);
                         $("#productmodel21a4g").html('/'+value.productmodel);
                         $("#output21a4g").html('/'+value.output);
                         $("#lighting21a4g").html('/'+value.lightting);
                         $("#manufacturer21a4g").html('/'+value.manufacturer);
                         $("#numberoflamps21a4g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C2') {
                         $("#productbrand21c2").html('/'+value.productbrand);
                         $("#productmodel21c2").html('/'+value.productmodel);
                         $("#output21c2").html('/'+value.output);
                         $("#lighting21c2").html('/'+value.lightting);
                         $("#manufacturer21c2").html('/'+value.manufacturer);
                         $("#numberoflamps21c2").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C3') {
                         $("#productbrand21c3").html('/'+value.productbrand);
                         $("#productmodel21c3").html('/'+value.productmodel);
                         $("#output21c3").html('/'+value.output);
                         $("#lighting21c3").html('/'+value.lightting);
                         $("#manufacturer21c3").html('/'+value.manufacturer);
                         $("#numberoflamps21c3").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C4') {
                         $("#productbrand21c4").html('/'+value.productbrand);
                         $("#productmodel21c4").html('/'+value.productmodel);
                         $("#output21c4").html('/'+value.output);
                         $("#lighting21c4").html('/'+value.lightting);
                         $("#manufacturer21c4").html('/'+value.manufacturer);
                         $("#numberoflamps21c4").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D2') {
                         $("#productbrand21d2x").html('/'+value.productbrand);
                         $("#productmodel21d2x").html('/'+value.productmodel);
                         $("#output21d2x").html('/'+value.output);
                         $("#lighting21d2x").html('/'+value.lightting);
                         $("#manufacturer21d2x").html('/'+value.manufacturer);
                         $("#numberoflamps21d2x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D3') {
                         $("#productbrand21d3x").html('/'+value.productbrand);
                         $("#productmodel21d3x").html('/'+value.productmodel);
                         $("#output21d3x").html('/'+value.output);
                         $("#lighting21d3x").html('/'+value.lightting);
                         $("#manufacturer21d3x").html('/'+value.manufacturer);
                         $("#numberoflamps21d3x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D4') {
                         $("#productbrand21d4x").html('/'+value.productbrand);
                         $("#productmodel21d4x").html('/'+value.productmodel);
                         $("#output21d4x").html('/'+value.output);
                         $("#lighting21d4x").html('/'+value.lightting);
                         $("#manufacturer21d4x").html('/'+value.manufacturer);
                         $("#numberoflamps21d4x").html('/'+value.numberoflamps);
                     }
                     
                     other_productsCount++;
                 });                    
                 
             }
         });        
     });     
});

$('#staticReportCommercialPage').live('pagehide', function(event, ui){
     $(this).remove();
 });
 

 $('#staticReportCommercialPage').live('pageshow', function(event){	 
	 hideSections(); 
 });
 
$('#staticReportCommercialPage').live('pagebeforeshow', function(event){ 
	var today = new Date();
     var dd = today.getDate();
     var mm = today.getMonth()+1; //January is 0!

     var yyyy = today.getFullYear();
     if(dd<10){dd='0'+dd;} 
     if(mm<10){mm='0'+mm;} 
     today = dd+'/'+mm+'/'+yyyy;
     $('#consumer_date').html(today);
     $('#installer_date').html(today);
	 
	 get_loggedin_user_data(function(response) {
         var query = document.URL.split("?")[1];			
         var id = query.replace("id=","");
         if(response == 1)
         {
             $('#loggedin_user_name5').html(logged_in_user_data.name);
             $('#installerNameDiv').html(logged_in_user_data.name);
             $('#installerFullNameDiv').html(logged_in_user_data.fullname);
         }
         get_saved_filled_data(id,function(response) {
             //console.log(response);
             
             if(response == 1)
             {
                 var previous_spc = "";
                 var previous_spc_txt = "";
                 if(last_filled_data_array.previous_spc != '')
                 {
                     previous_spc = 'Y';
                     previous_spc_txt = last_filled_data_array.previous_spc;
                 }else{
                     
                     previous_spc = 'N';
                 }
                 
                 //alert(last_filled_data_array.company_name);
                 
                 //alert($("#company_name").attr("id"));
                 
                 $("#d_company_name").html(last_filled_data_array.company_name);
                 $("#d_abn").html(last_filled_data_array.abn);
                 $("#d_industry_type").html(last_filled_data_array.industry_type);
                 $("#d_job_title").html(last_filled_data_array.job_title);
                 $("#d_total_floor_space").html(last_filled_data_array.total_floor_space);
                 $("#d_number_of_levels").html(last_filled_data_array.number_of_levels);
                 
                 if(last_filled_data_array.electricalSafetyCheck)
                 {
                     $("#d_has_electrical_safety_certificate").html('Y');
                 }else{
                     
                 	$("#d_has_electrical_safety_certificate").html('N');
                 }
                 
                 //alert('relevantCertificateCheck '+last_filled_data_array.relevantCertificateCheck);
                 
                 if(last_filled_data_array.relevantCertificateCheck == 1 )
                 {
                     $("#d_provide_relevant_certificate").html('Y');
                 }else{
                     
                 	$("#d_provide_relevant_certificate").html('N');
                 }                    
                                    
                 $(".d_first_name").html(last_filled_data_array.first_name);
                 $(".d_last_name").html(last_filled_data_array.last_name);
                 $("#d_unit_num").html(last_filled_data_array.unit_num);
                 $("#d_street_num").html(last_filled_data_array.street_num);
                 $("#d_street_name").html(last_filled_data_array.street_name);
                 $("#d_street_type").html(last_filled_data_array.street_type);
                 $("#d_town").html(last_filled_data_array.town);
                 
                 $("#d_state").html(last_filled_data_array.state);
                 $("#d_postcode").html(last_filled_data_array.postcode);
                 $("#d_len_of_time").html(last_filled_data_array.len_of_time);
                 $("#d_duration").html(last_filled_data_array.duration);
                 $("#d_tenant_or_owner").html(last_filled_data_array.tenant_or_owner);
                 $("#d_alt_num").html(last_filled_data_array.alt_num);
                 
                 if(last_filled_data_array.dob != '')
                 {
                     $("#d_dob").html(last_filled_data_array.dob);
                 }                    
                 
                 if(last_filled_data_array.postal_address != '') {
                 	$("#postal_address").html(last_filled_data_array.postal_address);                    	
                 }
                 
                 $("#d_cust_email").html(last_filled_data_array.cust_email);
                 $("#d_previous_spc").html(previous_spc);
                 $(".d_phone_num").html(last_filled_data_array.phone_num);
                 $("#cust_sig").attr('src', last_filled_data_array.customer_signature);
                 $("#cust_sig2").attr('src', last_filled_data_array.customer_signature);
                 $("#inst_sig").attr('src', last_filled_data_array.installer_signature);
                 
                 var datetimemilliseconds = parseInt(last_filled_data_array.create_time)*1000;
                 var installationDateObj = new Date(datetimemilliseconds);
                 var dateFormat = installationDateObj.getDate()+"-"+(installationDateObj.getMonth()+1)+"-"+installationDateObj.getFullYear();
                 $("#installation_date").html(dateFormat);
                 $("#installation_date2").html(dateFormat);
                 

                 
                 if(last_filled_data_array.add_spc_reason.length > 10)
                 {
                     last_filled_data_array.add_spc_reason = last_filled_data_array.add_spc_reason.substr(0,10)+"...";
                 }
                 
                 if(previous_spc_txt.length > 10)
                 {
                     previous_spc_txt = previous_spc_txt.substr(0,10)+"...";
                 }
                 
                 $("#d_previous_spc_text").html(previous_spc_txt);
                 $("#d_add_spc_reason").html(last_filled_data_array.add_spc_reason);
                 
                 
                 var productsCount = 1;
                 $.each(last_filled_data_array.products, function(index, value) {

                     if(value.product_num <= last_filled_data_array.num_spc_installed)
                     {
                         $("#d_productserialnum"+value.product_num).html(value.productserialnum);
                         $("#d_productroomtype"+value.product_num).html(value.productroomtype);
                         
                         var productsselectedcount = 0;
                         
                         if(value.applicationa != '-' && value.applicationa != ''){ productsselectedcount++; }
                         if(value.applicationb != '-' && value.applicationb != ''){ productsselectedcount++; }
                         if(value.applicationc != '-' && value.applicationc != ''){ productsselectedcount++; }
                         if(value.applicationd != '-' && value.applicationd != ''){ productsselectedcount++; }
                         
                         $("#d_controlappliences"+value.product_num).html(productsselectedcount);
                         if(productsselectedcount > 0)
                         {
                             $('#dclspc1').show();
                             $('#dclspc2').show();
                             $('#dcl5').show();
                             $('#dcle').show();
                         }
                     }
                     
                     productsCount++;
                 });
					
                 var other_productsCount = 1;
                 var cnt = 2;
                 $.each(last_filled_data_array.other_products, function(index, value) {
                    
                     var prdtypeid = value.producttype.replace(" ", "-");
						
						

                     $("#tr"+prdtypeid).show();
                     $("#tr"+prdtypeid+"1").show();
                     $("#section_name"+prdtypeid).html(value.producttype);
                     $("#product_model"+prdtypeid).html(value.productmodel);
                     $("#product_brand"+prdtypeid).html(value.productbrand);
                     $("#measures"+prdtypeid).html(value.measures);
                     
                     // check duplicate justification text
                     if(value.djcheck == 1) {
                     	//$("#before_justification_area").before('<tr><td bgcolor="#CCCCCC" colspan="36">'+value.measures+'</td></tr>');
                     	$("#installing_additional_product_reasons").before(value.measures+'<br/>');
                     }
                     
                     // measures, djcheck
                     $("#sealed"+prdtypeid).html(value.sealed);
                     $("#output"+prdtypeid).html(value.output);
                     $("#lighting"+prdtypeid).html(value.lightting);
                     $("#manufacturer"+prdtypeid).html(value.manufacturer);
                     $("#lamps"+prdtypeid).html(value.numberoflamps);
                     if(prdtypeid == 'IHD')
                     {
                         $('#dclihd1').show();
                         $('#dclihd2').show();
                         $('#dcl6').show();
                         $('#dclf').show();
                     } else if(prdtypeid == 'Door-Seals') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == 'Chimney-Baloons') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == '21A') {
                         //$('#dclli1').show();
                        // $('#dclli2').show();
                         //$('#dcl8').show();
                         //$('#dclh').show();
                         
                     } else if(prdtypeid == '21C-240V') {
                         //$('#dclli1').show();
                         //$('#dclli2').show();
                         //$('#dcl8').show();
                         //$('#dclh').show();
							
							/*  New Block */
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21CNetPrice").text('Reduced Price');
                         }
                         
                         if(value.circuittext == "Yes") {
                         	$("#circuitTextDimmable").text("Yes "+value.dimmableCircuitLampInstallations);
                         }
                         
                         if(value.halogen_downlights_replaced_check == 1) {
                         	$("#halogen_check").text("Yes");
                         }else{
                         	$("#halogen_check").text("No");
                         }
                         
                         //alert(value.numberoflamps);
                                                   
                         $("#numberOfLamps21C").text(value.numberoflamps);
                         
                         $("#transformerType").text(value.installedlamps);                            
                         
                         $("#transformerModel").text(value.installedlamps2);
                         
                         $("#transformer_name").text(value.productbrand21cTransformerName);
                         
                         $("#transformer_model").text(value.productbrand21cTransformerModel);
                         
                         $("#electrical_safety_no").text(value.productbrand21cElectricalSafetyNo);
							
							/*  New Block */
                         
                     } else if(prdtypeid == '21C-12V') {
                         console.log('mynameisdanish');
                         //$('#dclli1').show();
                         //$('#dclli2').show();
                         //$('#dcl8').show();
                         //$('#dclh').show();
							
							/*  New Block */
							
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21DNetPrice").text('Reduced Price');
                         }
                         
                         $("#numberOfLamps21D").text(value.numberoflamps);
                         
                         $("#above_installation").text(value.above_installation);
							
							/*  New Block */
                         
                     } else if(prdtypeid == 'A2') {
                         $("#productbrand21a2g").html('/'+value.productbrand);
                         $("#productmodel21a2g").html('/'+value.productmodel);
                         $("#output21a2g").html('/'+value.output);
                         $("#lighting21a2g").html('/'+value.lightting);
                         $("#manufacturer21a2g").html('/'+value.manufacturer);
                         $("#numberoflamps21a2g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A3') {
                         $("#productbrand21a3g").html('/'+value.productbrand);
                         $("#productmodel21a3g").html('/'+value.productmodel);
                         $("#output21a3g").html('/'+value.output);
                         $("#lighting21a3g").html('/'+value.lightting);
                         $("#manufacturer21a3g").html('/'+value.manufacturer);
                         $("#numberoflamps21a3g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A4') {
                         $("#productbrand21a4g").html('/'+value.productbrand);
                         $("#productmodel21a4g").html('/'+value.productmodel);
                         $("#output21a4g").html('/'+value.output);
                         $("#lighting21a4g").html('/'+value.lightting);
                         $("#manufacturer21a4g").html('/'+value.manufacturer);
                         $("#numberoflamps21a4g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C2') {
                         $("#productbrand21c2").html('/'+value.productbrand);
                         $("#productmodel21c2").html('/'+value.productmodel);
                         $("#output21c2").html('/'+value.output);
                         $("#lighting21c2").html('/'+value.lightting);
                         $("#manufacturer21c2").html('/'+value.manufacturer);
                         $("#numberoflamps21c2").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C3') {
                         $("#productbrand21c3").html('/'+value.productbrand);
                         $("#productmodel21c3").html('/'+value.productmodel);
                         $("#output21c3").html('/'+value.output);
                         $("#lighting21c3").html('/'+value.lightting);
                         $("#manufacturer21c3").html('/'+value.manufacturer);
                         $("#numberoflamps21c3").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C4') {
                         $("#productbrand21c4").html('/'+value.productbrand);
                         $("#productmodel21c4").html('/'+value.productmodel);
                         $("#output21c4").html('/'+value.output);
                         $("#lighting21c4").html('/'+value.lightting);
                         $("#manufacturer21c4").html('/'+value.manufacturer);
                         $("#numberoflamps21c4").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D2') {
                         $("#productbrand21d2x").html('/'+value.productbrand);
                         $("#productmodel21d2x").html('/'+value.productmodel);
                         $("#output21d2x").html('/'+value.output);
                         $("#lighting21d2x").html('/'+value.lightting);
                         $("#manufacturer21d2x").html('/'+value.manufacturer);
                         $("#numberoflamps21d2x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D3') {
                         $("#productbrand21d3x").html('/'+value.productbrand);
                         $("#productmodel21d3x").html('/'+value.productmodel);
                         $("#output21d3x").html('/'+value.output);
                         $("#lighting21d3x").html('/'+value.lightting);
                         $("#manufacturer21d3x").html('/'+value.manufacturer);
                         $("#numberoflamps21d3x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D4') {
                         $("#productbrand21d4x").html('/'+value.productbrand);
                         $("#productmodel21d4x").html('/'+value.productmodel);
                         $("#output21d4x").html('/'+value.output);
                         $("#lighting21d4x").html('/'+value.lightting);
                         $("#manufacturer21d4x").html('/'+value.manufacturer);
                         $("#numberoflamps21d4x").html('/'+value.numberoflamps);
                     }
                     
                     other_productsCount++;
                     if(cnt == 4)
                     {
                         cnt = 2;
                     }
                 });
             }
         });         
     });
});
 
 $('#reportPage').live('pagecreate', function(event){
     var today = new Date();
     var dd = today.getDate();
     var mm = today.getMonth()+1; //January is 0!

     var yyyy = today.getFullYear();
     if(dd<10){dd='0'+dd;} 
     if(mm<10){mm='0'+mm;} 
     today = dd+'/'+mm+'/'+yyyy;
     $('#consumer_date').html(today);
     $('#installer_date').html(today);

     get_loggedin_user_data(function(response) {
         
         if(response == 1)
         {
             $('#loggedin_user_name5').html(logged_in_user_data.name);
             $('#installerNameDiv').html(logged_in_user_data.name);
             $('#installerFullNameDiv').html(logged_in_user_data.fullname);
         }
         get_filled_data(function(response) {
             //console.log(response);
             
             if(response == 1)
             {
                 var previous_spc = "";
                 var previous_spc_txt = "";
                 if(last_filled_data_array.previous_spc != '')
                 {
                     previous_spc = 'Y';
                     previous_spc_txt = last_filled_data_array.previous_spc;
                 }else{
                     
                     previous_spc = 'N';
                 }
                 
                 $("#d_first_name").html(last_filled_data_array.first_name);
                 $("#d_last_name").html(last_filled_data_array.last_name);
                 $("#d_unit_num").html(last_filled_data_array.unit_num);
                 $("#d_street_num").html(last_filled_data_array.street_num);
                 $("#d_street_name").html(last_filled_data_array.street_name);
                 $("#d_street_type").html(last_filled_data_array.street_type);
                 $("#d_town").html(last_filled_data_array.town);
                 
                 $("#d_state").html(last_filled_data_array.state);
                 $("#d_postcode").html(last_filled_data_array.postcode);
                 $("#d_len_of_time").html(last_filled_data_array.len_of_time);
                 $("#d_duration").html(last_filled_data_array.duration);
                 $("#d_tenant_or_owner").html(last_filled_data_array.tenant_or_owner);
                 $("#d_alt_num").html(last_filled_data_array.alt_num);
                 
                 if(last_filled_data_array.dob != '')
                 {
                     $("#d_dob").html(last_filled_data_array.dob);
                 }                    
                 
                 if(last_filled_data_array.postal_address != '') {
                 	$("#postal_address").html(last_filled_data_array.postal_address);                    	
                 }
                 
                 $("#d_cust_email").html(last_filled_data_array.cust_email);
                 $("#d_previous_spc").html(previous_spc);
                 $("#d_phone_num").html(last_filled_data_array.phone_num);
                 $("#cust_sig").attr('src', last_filled_data_array.customer_signature);
                 $("#cust_sig2").attr('src', last_filled_data_array.customer_signature);
                 $("#inst_sig").attr('src', last_filled_data_array.installer_signature);
                 
                 var datetimemilliseconds = parseInt(last_filled_data_array.create_time)*1000;
                 var installationDateObj = new Date(datetimemilliseconds);
                 var dateFormat = installationDateObj.getDate()+"-"+(installationDateObj.getMonth()+1)+"-"+installationDateObj.getFullYear();
                 $("#installation_date").html(dateFormat);
                 $("#installation_date2").html(dateFormat);
                 

                 
                 if(last_filled_data_array.add_spc_reason.length > 10)
                 {
                     last_filled_data_array.add_spc_reason = last_filled_data_array.add_spc_reason.substr(0,10)+"...";
                 }
                 
                 if(previous_spc_txt.length > 10)
                 {
                     previous_spc_txt = previous_spc_txt.substr(0,10)+"...";
                 }
                 
                 $("#d_previous_spc_text").html(previous_spc_txt);
                 $("#d_add_spc_reason").html(last_filled_data_array.add_spc_reason);
                 
                 
                 var productsCount = 1;
                 $.each(last_filled_data_array.products, function(index, value) {

                     if(value.product_num <= last_filled_data_array.num_spc_installed)
                     {
                         $("#d_productserialnum"+value.product_num).html(value.productserialnum);
                         $("#d_productroomtype"+value.product_num).html(value.productroomtype);
                         
                         var productsselectedcount = 0;
                         
                         if(value.applicationa != '-' && value.applicationa != ''){ productsselectedcount++; }
                         if(value.applicationb != '-' && value.applicationb != ''){ productsselectedcount++; }
                         if(value.applicationc != '-' && value.applicationc != ''){ productsselectedcount++; }
                         if(value.applicationd != '-' && value.applicationd != ''){ productsselectedcount++; }
                         
                         $("#d_controlappliences"+value.product_num).html(productsselectedcount);
                         if(productsselectedcount > 0)
                         {
                             $('#dclspc1').show();
                             $('#dclspc2').show();
                             $('#dcl5').show();
                             $('#dcle').show();
                         }
                     }
                     
                     productsCount++;
                 });
					
                 var other_productsCount = 1;
                 var cnt = 2;
                 $.each(last_filled_data_array.other_products, function(index, value) {
                    
                     var prdtypeid = value.producttype.replace(" ", "-");
						
						//alert(index);

                     $("#tr"+prdtypeid).show();
                     $("#tr"+prdtypeid+"1").show();
                     $("#section_name"+prdtypeid).html(value.producttype);
                     $("#product_model"+prdtypeid).html(value.productmodel);
                     $("#product_brand"+prdtypeid).html(value.productbrand);
                     $("#measures"+prdtypeid).html(value.measures);
                     
                     // check duplicate justification text
                     if(value.djcheck == 1) {
                     	//$("#before_justification_area").before('<tr><td bgcolor="#CCCCCC" colspan="36">'+value.measures+'</td></tr>');
                     	$("#before_justification_area").before(value.measures+'<br/>');
                     }
                     
                     // measures, djcheck
                     $("#sealed"+prdtypeid).html(value.sealed);
                     $("#output"+prdtypeid).html(value.output);
                     $("#lighting"+prdtypeid).html(value.lightting);
                     $("#manufacturer"+prdtypeid).html(value.manufacturer);
                     $("#lamps"+prdtypeid).html(value.numberoflamps);
                     if(prdtypeid == 'IHD')
                     {
                         $('#dclihd1').show();
                         $('#dclihd2').show();
                         $('#dcl6').show();
                         $('#dclf').show();
                     } else if(prdtypeid == 'Door-Seals') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == 'Chimney-Baloons') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == '21A') {
                         $('#dclli1').show();
                         $('#dclli2').show();
                         $('#dcl8').show();
                         $('#dclh').show();
                         
                     } else if(prdtypeid == '21C-240V') {
                         $('#dclli1').show();
                         $('#dclli2').show();
                         $('#dcl8').show();
                         $('#dclh').show();
							
							/*  New Block */
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21CNetPrice").text('Reduced Price');
                         }
                         
                         if(value.circuittext == "Yes") {
                         	$("#circuitTextDimmable").text("Yes "+value.dimmableCircuitLampInstallations);
                         }
                         
                         if(value.halogen_downlights_replaced_check == 1) {
                         	$("#halogen_check").text("Yes");
                         }else{
                         	$("#halogen_check").text("No");
                         }
                                                   
                         $("#numberOfLamps21C").text(value.numberoflamps);
                         
                         $("#transformerType").text(value.installedlamps);                            
                         
                         $("#transformerModel").text(value.installedlamps2);
                         
                         $("#transformer_name").text(value.productbrand21cTransformerName);
                         
                         $("#transformer_model").text(value.productbrand21cTransformerModel);
                         
                         $("#electrical_safety_no").text(value.productbrand21cElectricalSafetyNo);
							
							/*  New Block */
                         
                     } else if(prdtypeid == '21C-12V') {
                         console.log('mynameisdanish');
                         $('#dclli1').show();
                         $('#dclli2').show();
                         $('#dcl8').show();
                         $('#dclh').show();
							
							/*  New Block */
							
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21DNetPrice").text('Reduced Price');
                         }
                         
                         $("#numberOfLamps21D").text(value.numberoflamps);
                         
                         $("#above_installation").text(value.above_installation);
							
							/*  New Block */
                         
                     } else if(prdtypeid == 'A2') {
                         $("#productbrand21a2g").html('/'+value.productbrand);
                         $("#productmodel21a2g").html('/'+value.productmodel);
                         $("#output21a2g").html('/'+value.output);
                         $("#lighting21a2g").html('/'+value.lightting);
                         $("#manufacturer21a2g").html('/'+value.manufacturer);
                         $("#numberoflamps21a2g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A3') {
                         $("#productbrand21a3g").html('/'+value.productbrand);
                         $("#productmodel21a3g").html('/'+value.productmodel);
                         $("#output21a3g").html('/'+value.output);
                         $("#lighting21a3g").html('/'+value.lightting);
                         $("#manufacturer21a3g").html('/'+value.manufacturer);
                         $("#numberoflamps21a3g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A4') {
                         $("#productbrand21a4g").html('/'+value.productbrand);
                         $("#productmodel21a4g").html('/'+value.productmodel);
                         $("#output21a4g").html('/'+value.output);
                         $("#lighting21a4g").html('/'+value.lightting);
                         $("#manufacturer21a4g").html('/'+value.manufacturer);
                         $("#numberoflamps21a4g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C2') {
                         $("#productbrand21c2").html('/'+value.productbrand);
                         $("#productmodel21c2").html('/'+value.productmodel);
                         $("#output21c2").html('/'+value.output);
                         $("#lighting21c2").html('/'+value.lightting);
                         $("#manufacturer21c2").html('/'+value.manufacturer);
                         $("#numberoflamps21c2").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C3') {
                         $("#productbrand21c3").html('/'+value.productbrand);
                         $("#productmodel21c3").html('/'+value.productmodel);
                         $("#output21c3").html('/'+value.output);
                         $("#lighting21c3").html('/'+value.lightting);
                         $("#manufacturer21c3").html('/'+value.manufacturer);
                         $("#numberoflamps21c3").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C4') {
                         $("#productbrand21c4").html('/'+value.productbrand);
                         $("#productmodel21c4").html('/'+value.productmodel);
                         $("#output21c4").html('/'+value.output);
                         $("#lighting21c4").html('/'+value.lightting);
                         $("#manufacturer21c4").html('/'+value.manufacturer);
                         $("#numberoflamps21c4").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D2') {
                         $("#productbrand21d2x").html('/'+value.productbrand);
                         $("#productmodel21d2x").html('/'+value.productmodel);
                         $("#output21d2x").html('/'+value.output);
                         $("#lighting21d2x").html('/'+value.lightting);
                         $("#manufacturer21d2x").html('/'+value.manufacturer);
                         $("#numberoflamps21d2x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D3') {
                         $("#productbrand21d3x").html('/'+value.productbrand);
                         $("#productmodel21d3x").html('/'+value.productmodel);
                         $("#output21d3x").html('/'+value.output);
                         $("#lighting21d3x").html('/'+value.lightting);
                         $("#manufacturer21d3x").html('/'+value.manufacturer);
                         $("#numberoflamps21d3x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D4') {
                         $("#productbrand21d4x").html('/'+value.productbrand);
                         $("#productmodel21d4x").html('/'+value.productmodel);
                         $("#output21d4x").html('/'+value.output);
                         $("#lighting21d4x").html('/'+value.lightting);
                         $("#manufacturer21d4x").html('/'+value.manufacturer);
                         $("#numberoflamps21d4x").html('/'+value.numberoflamps);
                     }
                     
                     other_productsCount++;
                     if(cnt == 4)
                     {
                         cnt = 2;
                     }
                 });
             }
         });
         
     });
});
 
 $('#reportPage').live('pagehide', function(event, ui){
     $(this).remove();
 });
 
 $("#reportPage").live('pagebeforeshow', function(event, data) {
	    
	    previouspage = data.prevPage;
});
 
 $('#reportCommercialPage').live('pagehide', function(event, ui){
     $(this).remove();
 });
 $('#reportCommercialPage').live('pagecreate', function(event){
     //alert('mj');
	 var today = new Date();
     var dd = today.getDate();
     var mm = today.getMonth()+1; //January is 0!

     var yyyy = today.getFullYear();
     if(dd<10){dd='0'+dd;} 
     if(mm<10){mm='0'+mm;} 
     today = dd+'/'+mm+'/'+yyyy;
     $('#consumer_date').html(today);
     $('#installer_date').html(today);

     get_loggedin_user_data(function(response) {
         
         if(response == 1)
         {
             $('#loggedin_user_name5').html(logged_in_user_data.name);
             $('#installerNameDiv').html(logged_in_user_data.name);
             $('#installerFullNameDiv').html(logged_in_user_data.fullname);
         }
         get_filled_data(function(response) {
             //console.log(response);
             
             if(response == 1)
             {
                 var previous_spc = "";
                 var previous_spc_txt = "";
                 if(last_filled_data_array.previous_spc != '')
                 {
                     previous_spc = 'Y';
                     previous_spc_txt = last_filled_data_array.previous_spc;
                 }else{
                     
                     previous_spc = 'N';
                 }
                 
                 //alert(last_filled_data_array.company_name);
                 
                 //alert($("#company_name").attr("id"));
                 
                 $("#d_company_name").html(last_filled_data_array.company_name);
                 $("#d_abn").html(last_filled_data_array.abn);
                 $("#d_industry_type").html(last_filled_data_array.industry_type);
                 $("#d_job_title").html(last_filled_data_array.job_title);
                 $("#d_total_floor_space").html(last_filled_data_array.total_floor_space);
                 $("#d_number_of_levels").html(last_filled_data_array.number_of_levels);
                 
                 if(last_filled_data_array.electricalSafetyCheck)
                 {
                     $("#d_has_electrical_safety_certificate").html('Y');
                 }else{
                     
                 	$("#d_has_electrical_safety_certificate").html('N');
                 }
                 
                 //alert('relevantCertificateCheck '+last_filled_data_array.relevantCertificateCheck);
                 
                 if(last_filled_data_array.relevantCertificateCheck == 1 )
                 {
                     $("#d_provide_relevant_certificate").html('Y');
                 }else{
                     
                 	$("#d_provide_relevant_certificate").html('N');
                 }                    
                                    
                 $(".d_first_name").html(last_filled_data_array.first_name);
                 $(".d_last_name").html(last_filled_data_array.last_name);
                 $("#d_unit_num").html(last_filled_data_array.unit_num);
                 $("#d_street_num").html(last_filled_data_array.street_num);
                 $("#d_street_name").html(last_filled_data_array.street_name);
                 $("#d_street_type").html(last_filled_data_array.street_type);
                 $("#d_town").html(last_filled_data_array.town);
                 
                 $("#d_state").html(last_filled_data_array.state);
                 $("#d_postcode").html(last_filled_data_array.postcode);
                 $("#d_len_of_time").html(last_filled_data_array.len_of_time);
                 $("#d_duration").html(last_filled_data_array.duration);
                 $("#d_tenant_or_owner").html(last_filled_data_array.tenant_or_owner);
                 $("#d_alt_num").html(last_filled_data_array.alt_num);
                 
                 if(last_filled_data_array.dob != '')
                 {
                     $("#d_dob").html(last_filled_data_array.dob);
                 }                    
                 
                 if(last_filled_data_array.postal_address != '') {
                 	$("#postal_address").html(last_filled_data_array.postal_address);                    	
                 }
                 
                 $("#d_cust_email").html(last_filled_data_array.cust_email);
                 $("#d_previous_spc").html(previous_spc);
                 $(".d_phone_num").html(last_filled_data_array.phone_num);
                 $("#cust_sig").attr('src', last_filled_data_array.customer_signature);
                 $("#cust_sig2").attr('src', last_filled_data_array.customer_signature);
                 $("#inst_sig").attr('src', last_filled_data_array.installer_signature);
                 
                 var datetimemilliseconds = parseInt(last_filled_data_array.create_time)*1000;
                 var installationDateObj = new Date(datetimemilliseconds);
                 var dateFormat = installationDateObj.getDate()+"-"+(installationDateObj.getMonth()+1)+"-"+installationDateObj.getFullYear();
                 $("#installation_date").html(dateFormat);
                 $("#installation_date2").html(dateFormat);
                 

                 
                 if(last_filled_data_array.add_spc_reason.length > 10)
                 {
                     last_filled_data_array.add_spc_reason = last_filled_data_array.add_spc_reason.substr(0,10)+"...";
                 }
                 
                 if(previous_spc_txt.length > 10)
                 {
                     previous_spc_txt = previous_spc_txt.substr(0,10)+"...";
                 }
                 
                 $("#d_previous_spc_text").html(previous_spc_txt);
                 $("#d_add_spc_reason").html(last_filled_data_array.add_spc_reason);
                 
                 
                 var productsCount = 1;
                 $.each(last_filled_data_array.products, function(index, value) {

                     if(value.product_num <= last_filled_data_array.num_spc_installed)
                     {
                         $("#d_productserialnum"+value.product_num).html(value.productserialnum);
                         $("#d_productroomtype"+value.product_num).html(value.productroomtype);
                         
                         var productsselectedcount = 0;
                         
                         if(value.applicationa != '-' && value.applicationa != ''){ productsselectedcount++; }
                         if(value.applicationb != '-' && value.applicationb != ''){ productsselectedcount++; }
                         if(value.applicationc != '-' && value.applicationc != ''){ productsselectedcount++; }
                         if(value.applicationd != '-' && value.applicationd != ''){ productsselectedcount++; }
                         
                         $("#d_controlappliences"+value.product_num).html(productsselectedcount);
                         if(productsselectedcount > 0)
                         {
                             $('#dclspc1').show();
                             $('#dclspc2').show();
                             $('#dcl5').show();
                             $('#dcle').show();
                         }
                     }
                     
                     productsCount++;
                 });
					
                 var other_productsCount = 1;
                 var cnt = 2;
                 $.each(last_filled_data_array.other_products, function(index, value) {
                    
                     var prdtypeid = value.producttype.replace(" ", "-");
						
						

                     $("#tr"+prdtypeid).show();
                     $("#tr"+prdtypeid+"1").show();
                     $("#section_name"+prdtypeid).html(value.producttype);
                     $("#product_model"+prdtypeid).html(value.productmodel);
                     $("#product_brand"+prdtypeid).html(value.productbrand);
                     $("#measures"+prdtypeid).html(value.measures);
                     
                     // check duplicate justification text
                     if(value.djcheck == 1) {
                     	//$("#before_justification_area").before('<tr><td bgcolor="#CCCCCC" colspan="36">'+value.measures+'</td></tr>');
                     	$("#installing_additional_product_reasons").before(value.measures+'<br/>');
                     }
                     
                     // measures, djcheck
                     $("#sealed"+prdtypeid).html(value.sealed);
                     $("#output"+prdtypeid).html(value.output);
                     $("#lighting"+prdtypeid).html(value.lightting);
                     $("#manufacturer"+prdtypeid).html(value.manufacturer);
                     $("#lamps"+prdtypeid).html(value.numberoflamps);
                     if(prdtypeid == 'IHD')
                     {
                         $('#dclihd1').show();
                         $('#dclihd2').show();
                         $('#dcl6').show();
                         $('#dclf').show();
                     } else if(prdtypeid == 'Door-Seals') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == 'Chimney-Baloons') {
                         $('#dclws1').show();
                         $('#dclws2').show();
                         $('#dcl7').show();
                         $('#dclg').show();
                     } else if(prdtypeid == '21A') {
                         //$('#dclli1').show();
                        // $('#dclli2').show();
                         //$('#dcl8').show();
                         //$('#dclh').show();
                         
                     } else if(prdtypeid == '21C-240V') {
                         //$('#dclli1').show();
                         //$('#dclli2').show();
                         //$('#dcl8').show();
                         //$('#dclh').show();
							
							/*  New Block */
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21CNetPrice").text('Reduced Price');
                         }
                         
                         if(value.circuittext == "Yes") {
                         	$("#circuitTextDimmable").text("Yes "+value.dimmableCircuitLampInstallations);
                         }
                         
                         if(value.halogen_downlights_replaced_check == 1) {
                         	$("#halogen_check").text("Yes");
                         }else{
                         	$("#halogen_check").text("No");
                         }
                         
                         //alert(value.numberoflamps);
                                                   
                         $("#numberOfLamps21C").text(value.numberoflamps);
                         
                         $("#transformerType").text(value.installedlamps);                            
                         
                         $("#transformerModel").text(value.installedlamps2);
                         
                         $("#transformer_name").text(value.productbrand21cTransformerName);
                         
                         $("#transformer_model").text(value.productbrand21cTransformerModel);
                         
                         $("#electrical_safety_no").text(value.productbrand21cElectricalSafetyNo);
							
							/*  New Block */
                         
                     } else if(prdtypeid == '21C-12V') {
                         console.log('mynameisdanish');
                         //$('#dclli1').show();
                         //$('#dclli2').show();
                         //$('#dcl8').show();
                         //$('#dclh').show();
							
							/*  New Block */
							
                         if(!isNaN(value.costper) && value.costper > 0) {
                         	$("#costperled21DNetPrice").text('Reduced Price');
                         }
                         
                         $("#numberOfLamps21D").text(value.numberoflamps);
                         
                         $("#above_installation").text(value.above_installation);
							
							/*  New Block */
                         
                     } else if(prdtypeid == 'A2') {
                         $("#productbrand21a2g").html('/'+value.productbrand);
                         $("#productmodel21a2g").html('/'+value.productmodel);
                         $("#output21a2g").html('/'+value.output);
                         $("#lighting21a2g").html('/'+value.lightting);
                         $("#manufacturer21a2g").html('/'+value.manufacturer);
                         $("#numberoflamps21a2g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A3') {
                         $("#productbrand21a3g").html('/'+value.productbrand);
                         $("#productmodel21a3g").html('/'+value.productmodel);
                         $("#output21a3g").html('/'+value.output);
                         $("#lighting21a3g").html('/'+value.lightting);
                         $("#manufacturer21a3g").html('/'+value.manufacturer);
                         $("#numberoflamps21a3g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'A4') {
                         $("#productbrand21a4g").html('/'+value.productbrand);
                         $("#productmodel21a4g").html('/'+value.productmodel);
                         $("#output21a4g").html('/'+value.output);
                         $("#lighting21a4g").html('/'+value.lightting);
                         $("#manufacturer21a4g").html('/'+value.manufacturer);
                         $("#numberoflamps21a4g").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C2') {
                         $("#productbrand21c2").html('/'+value.productbrand);
                         $("#productmodel21c2").html('/'+value.productmodel);
                         $("#output21c2").html('/'+value.output);
                         $("#lighting21c2").html('/'+value.lightting);
                         $("#manufacturer21c2").html('/'+value.manufacturer);
                         $("#numberoflamps21c2").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C3') {
                         $("#productbrand21c3").html('/'+value.productbrand);
                         $("#productmodel21c3").html('/'+value.productmodel);
                         $("#output21c3").html('/'+value.output);
                         $("#lighting21c3").html('/'+value.lightting);
                         $("#manufacturer21c3").html('/'+value.manufacturer);
                         $("#numberoflamps21c3").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'C4') {
                         $("#productbrand21c4").html('/'+value.productbrand);
                         $("#productmodel21c4").html('/'+value.productmodel);
                         $("#output21c4").html('/'+value.output);
                         $("#lighting21c4").html('/'+value.lightting);
                         $("#manufacturer21c4").html('/'+value.manufacturer);
                         $("#numberoflamps21c4").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D2') {
                         $("#productbrand21d2x").html('/'+value.productbrand);
                         $("#productmodel21d2x").html('/'+value.productmodel);
                         $("#output21d2x").html('/'+value.output);
                         $("#lighting21d2x").html('/'+value.lightting);
                         $("#manufacturer21d2x").html('/'+value.manufacturer);
                         $("#numberoflamps21d2x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D3') {
                         $("#productbrand21d3x").html('/'+value.productbrand);
                         $("#productmodel21d3x").html('/'+value.productmodel);
                         $("#output21d3x").html('/'+value.output);
                         $("#lighting21d3x").html('/'+value.lightting);
                         $("#manufacturer21d3x").html('/'+value.manufacturer);
                         $("#numberoflamps21d3x").html('/'+value.numberoflamps);
                     } else if(prdtypeid == 'D4') {
                         $("#productbrand21d4x").html('/'+value.productbrand);
                         $("#productmodel21d4x").html('/'+value.productmodel);
                         $("#output21d4x").html('/'+value.output);
                         $("#lighting21d4x").html('/'+value.lightting);
                         $("#manufacturer21d4x").html('/'+value.manufacturer);
                         $("#numberoflamps21d4x").html('/'+value.numberoflamps);
                     }
                     
                     other_productsCount++;
                     if(cnt == 4)
                     {
                         cnt = 2;
                     }
                 });
             }
         });
         
     });
});
 
 $("#reportCommercialPage").live('pagebeforeshow', function(event, data) {
	    
	    previouspage = data.prevPage;
});