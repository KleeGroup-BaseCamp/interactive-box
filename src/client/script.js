// wait for the html body to be loaded
document.addEventListener("DOMContentLoaded", function() {
   
   var adminButton = document.getElementById("adminButton");
   var userButton = document.getElementById("userButton");

   adminButton.onclick=function(){
   	window.location.href='./admin/'
   };

   userButton.onclick=function(){
   	window.location.href='./user/'
   };  
});