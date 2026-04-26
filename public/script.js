let userId = null;

function login(){
  fetch("/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username: user.value,
      password: pass.value
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.status==="ok"){
      userId = data.user.id;
      loadUser();
      loginBox.style.display="none";
dashboard.classList.remove("hidden");
    }else{
      alert("Login gagal");
    }
  })
}

function loadUser(){
  fetch("/user/"+userId)
  .then(res=>res.json())
  .then(data=>{
    name.innerText = "Halo " + data.username;
    balance.innerText = "Rp " + data.balance;
  })
}

function topup(){
  fetch("/topup",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      id:userId,
      amount:1000
    })
  }).then(()=>loadUser())
}
function register(){
  fetch("/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      username: user.value,
      password: pass.value
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.status==="ok"){
      alert("Register berhasil, silakan login");
    }else{
      alert("Register gagal");
    }
  })
}
function logout(){
  location.reload();
}
function showPage(page){
  document.getElementById("dashboardPage").style.display="none";
  document.getElementById("waPage").style.display="none";
  document.getElementById("saldoPage").style.display="none";
  document.getElementById("settingPage").style.display="none";

  document.getElementById(page + "Page").style.display="block";
}
