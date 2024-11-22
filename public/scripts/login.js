//balik ke landing page//
function landingPage() {
  location.href = 'http://localhost:5000/JobQues'
}

//password confirm
document.querySelector('.button').onclick = function() {
  var password = document.querySelector('.password').value
  var confirm = document.querySelector('.confirm').value

  if (password != confirm) {
    alert("Confirm Password didn't match with Password")
    return false
  }
}