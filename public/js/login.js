/**
 * Created by Amanpreet on 1/2/15.
 */

var loginButton; 
var signupButton; 
var submitButton;
var nameDiv;

//0 for login, 1 for signup
var curState;

 $( document ).ready(function() {
    
  loginButton = $(".loginButton");
  signupButton = $(".signupButton");
  submitButton = $(".submitButton");
  nameDiv = $(".nameDiv");
  curState = 0;

  loginButton.click(function(){
        nameDiv.hide();
        curState = 0;
    });

  signupButton.click(function(){
        nameDiv.show();
        curState = 1;
    });

  submitButton.click(function(){
        if (curState == 0){
          login();
        }
        else{
          signup();
        }
    });  

});

//request for logging in

function login(){

  var email = $(".emailBox").val();
  var pass = $(".passwordBox").val();

  $.ajax({
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    url: "/login/",
    data: JSON.stringify({username : email, password : pass})
}).done(function( msg ) {
    debug = msg;
    console.log(msg)
    if (msg['status'] == 0){
      alert(msg['message']);
    }
    else{
      console.log('success');
      //add a redirect here to profile page
    }
});
}

//request for signing up

function signup(){

  var name = $(".nameBox").val();
  var email = $(".emailBox").val();
  var pass = $(".passwordBox").val();

  postRequest("/signup", JSON.stringify({username : name, email : email, password : pass}), function(data){
    console.log(data);
    console.log("blah");
  });

  $.ajax({
     type: "POST",
     contentType: "application/json",
     dataType: "json",
     url: "/signup",
     data: JSON.stringify({username : name, email : email, password : pass})
   }).done(function( msg ) {
         debug = msg;
         console.log(msg);
         /*
         if (msg['status'] == 0){
          alert(msg['message']);
         }
         else{
          console.log('success');
          window.location.href = "/users/dashboard/";
          //window.location.replace("/users/dashboard");
         }
         */
       });
}

function connectionExists() {
    var xhr = new XMLHttpRequest();
    var file = "http://www.akandola.com/contact.php";

    xhr.open('HEAD', file, false);

    try {
        xhr.send();

        return xhr.status >= 200 && xhr.status < 304;
    } catch (e) {
        return false;
    }
}

function postRequest(url, params, funct, ajaxLoaderElement) {
    var element;
    var ajaxLoad = (arguments.length === 4);
    if (connectionExists()) {
        if (ajaxLoad) {
            var element = document.getElementById(ajaxLoaderElement);
            document.getElementById(ajaxLoaderElement).parentNode.replaceChild(loadIcon, element);
        }
        $.post(url, params,
            function(data){
                if (ajaxLoad) {
                    loadIcon.parentNode.replaceChild(element, loadIcon);
                    document.getElementById('body').appendChild(loadIcon);
                }
                funct(data);
            });
    } else {
        alert("There seems to be a problem connecting to our servers.");
        return;
    }
}

