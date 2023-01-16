import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { getAuth, signInWithPopup, GoogleAuthProvider,signOut  } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
import {getDatabase,set,ref,push,child,onValue,onChildAdded} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbpvzfNTXm3M8vAqK-0HLE6plSgF4vBD0",
  authDomain: "auth2-b72b0.firebaseapp.com",
  projectId: "auth2-b72b0",
  storageBucket: "auth2-b72b0.appspot.com",
  messagingSenderId: "171826316097",
  appId: "1:171826316097:web:950b331c4437e9f29397c0",
  measurementId: "G-865GVLDEZC"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const database = getDatabase(app);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  var Uid = "message";
  var randomId = "";
  // var mainData = "";
  var mainProfile = document.querySelector(".astroImg");
  var mainProName = document.querySelector(".pHeadingName");

  if(localStorage.getItem("logIn")){
    $(".bodyCol").show()
    $(".loginPage").hide()
    afterLogIn()
  }else{
    loginOp()
  }

  $(".GoogleLogIn").click(()=>{loginOp()});  

  function afterLogIn(){
    let userData = localStorage.getItem("mainData")
    userData = JSON.parse(userData)
    $(".bodyCol").show();
    $(".loginPage").hide();
    mainProfile.src = userData.uPhoto
    mainProName.innerHTML = userData.UName
  }

function loginOp(){
  signInWithPopup(auth, provider).then((result) => {
    const user = result.user;
    localStorage.setItem("logIn",true);
    let userData={"uid":user.uid,"UName":user.displayName,"uPhoto":user.photoURL};
     userData = JSON.stringify(userData) ;
    localStorage.setItem("mainData",userData);
    afterLogIn()
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    // console.log(error)
  });
}
 
$(".signOut").click(()=>{
  signOut(auth).then(() => {
    localStorage.removeItem("logIn");
    localStorage.removeItem("mainData");
    $(".bodyCol").hide();
    $(".loginPage").show();
  }).catch((error) => {});
})

$(".SendBtn").click(()=>{
  let userData = localStorage.getItem("mainData")
  userData = JSON.parse(userData);
  
  var message = document.querySelector(".inputBox").value;
  Uid = "message";
  const id = push(child(ref(database), Uid)).key;

  set(ref(database, `${Uid}/` + id), {
      uid: Uid,
      message: message,
      UName:userData.UName,
      uPhoto:userData.uPhoto
  });
  document.querySelector(".inputBox").value = ""

  // callmessage(id)

})

// async function callmessage(id){
  var d1 = document.querySelector('.showMessage');
  d1.innerHTML = "";
  const newMsg = ref(database, `${Uid}/`);
//  console.log(id)
  onChildAdded(newMsg, (data) => {
    // console.log(data)s
      // if(data.ref._path.pieces_[1] == id) {
      //  let  newMessage=`  <div class="messageCont">
      //   <img src="${data.val().uPhoto}" class="messageImg">
      //   <h6 class="Pmessage">${data.val().UName}</h6>
      //   <p>${data.val().message}</p>
      // </div>`
      
      // d1.insertAdjacentHTML("beforeend", newMessage);
      // }else{
        let newMessage=`  <div class="messageCont">
        <img src="${data.val().uPhoto}" class="messageImg">
        <h6 class="Pmessage">${data.val().UName}</h6>
        <p>${data.val().message}</p>
      </div>`

      d1.insertAdjacentHTML("beforeend", newMessage);
      // }
  });
// }
