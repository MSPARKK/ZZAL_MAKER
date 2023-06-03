// // Get the buttons by their ID
// var buttonEuljiro = document.getElementById('fontEuljiroButton');
// var buttonHapjeong = document.getElementById('hapjeongButton');

// // Add an event listener for the 'click' event
// buttonEuljiro.addEventListener('click', function() {
//     // This block of code will be executed when the '을지로체' button is clicked
//     alert('을지로체');
// });

// buttonHapjeong.addEventListener('click', function() {
//     // This block of code will be executed when the '합정체' button is clicked
//     alert('합정체');
// });


 // Get the buttons and divs by their ID
 var buttonEuljiro = document.getElementById('fontEuljiroButton');
 var buttonHapjeong = document.getElementById('hapjeongButton');
 var divTest1 = document.getElementById('test1');
 var divTest2 = document.getElementById('test2');

 // Add an event listener for the 'click' event
 buttonEuljiro.addEventListener('click', function() {
     // This block of code will be executed when the '을지로체' button is clicked
     divTest1.classList.add('hidden');
     divTest2.classList.remove('hidden');
 });

 buttonHapjeong.addEventListener('click', function() {
     // This block of code will be executed when the '합정체' button is clicked
     divTest2.classList.add('hidden');
     divTest1.classList.remove('hidden');
 });