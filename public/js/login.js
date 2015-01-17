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

    console.log("making request");
    $.ajax({
    type: "POST",
    contentType: "application/json",
    dataType: "json",
    url: "/test",
}).done(function( msg ) {
    debug = msg;
    console.log(msg)
    console.log("done");
});
    
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



