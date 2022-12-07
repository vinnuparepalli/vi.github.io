let firebaseConfig = {
  apiKey: "AIzaSyCXEx7CoeGulaGSy9e_r_a-e3CmaqT4R6o",
  authDomain: "novi3-a4fe5.firebaseapp.com",
  projectId: "novi3-a4fe5",
  storageBucket: "novi3-a4fe5.appspot.com",
  messagingSenderId: "447653574114",
  appId: "1:447653574114:web:4e5ff66c39b39e850735bb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
const database = firebase.database();
// Set up our register function
async function register() {
  // Get all our input fields
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  full_name = document.getElementById("full_name").value;
  if (validate_email(email) == false || validate_password(password) == false) {
    alert("Email or Password is Outta Line!!");
    return;
  }
  try {
    const usersRef = database.ref("users/" + email.split("@")[0]);
    var user_data = {
      email: email,
      full_name: full_name,
      password: password,
      role: "user",
      last_login: new Date().toLocaleString(),
      ticketCount: 0
    };
    await usersRef.set(user_data);
    //await auth.createUserWithEmailAndPassword(email, password);
    alert("User Created!!");
  } catch (err) {
    alert(err);
  }
}

// Set up our login function
async function login() {
  // Get all our input fields
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  try {
    // Validate input fields
    if (
      validate_email(email) == false ||
      validate_password(password) == false
    ) {
      alert("Email or Password is Outta Line!!");
      return;
    }
    //await auth.signInWithEmailAndPassword(email, password);
    var user_data = {
      last_login: new Date().toLocaleString(),
    };
    const usersRef = database.ref("users/" + email.split("@")[0]);
    usersRef.on(
      "value",
      async (snapshot) => {
        if (
          !snapshot.val() ||
          snapshot.val().email !== email ||
          snapshot.val().password !== password
        ) {
          alert("wrong credentials");
          return;
        }
        await usersRef.update(user_data);
        localStorage.setItem("user", email);
        open("main.html", function (err) {
          if (err) throw err;
        });
      },
      (errorObject) => {
        console.log("The read failed: " + errorObject.name);
      },
      {
        onlyOnce: true,
      }
    );
  } catch (err) {
    alert(err);
  }
}

// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/;
  if (expression.test(email) == true) {
    // Email is good
    return true;
  } else {
    // Email is not good
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false;
  } else {
    return true;
  }
}

function validate_field(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}