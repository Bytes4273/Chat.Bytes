/**
 * chat-app.js
 * JavaScript module to handle chat app UI interactions and Firebase authentication.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_lh_plP9mRyD48ph3E_6_QyJnTQqGZqE",
  authDomain: "bytes-world--business.firebaseapp.com",
  projectId: "bytes-world--business",
  storageBucket: "bytes-world--business.appspot.com",
  messagingSenderId: "226833017696",
  appId: "1:226833017696:web:11895a597a6e6c9a928c05",
  measurementId: "G-JQYDX6XEZJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// UI Elements
const loginScreen = document.getElementById("loginScreen");
const registrationScreen = document.getElementById("registrationScreen");
const profileBtn = document.getElementById("profileBtn");
const logoutBtn = document.getElementById("logoutBtn");
const showRegistrationBtn = document.getElementById("showRegistrationBtn");
const hideRegistrationBtn = document.getElementById("hideRegistrationBtn");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const sendPasswordResetBtn = document.getElementById("sendPasswordResetBtn");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// Show registration screen
showRegistrationBtn.addEventListener("click", () => {
  loginScreen.style.display = "none";
  registrationScreen.style.display = "block";
  clearMessages();
});

// Hide registration screen and show login screen
hideRegistrationBtn.addEventListener("click", () => {
  registrationScreen.style.display = "none";
  loginScreen.style.display = "block";
  clearMessages();
});

// Clear messages
function clearMessages() {
  errorMessage.style.display = "none";
  errorMessage.textContent = "";
  successMessage.style.display = "none";
  successMessage.textContent = "";
}

// Register new user
registerBtn.addEventListener("click", async () => {
  clearMessages();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const identityName = document.getElementById("identityName").value.trim();
  const avatarName = document.getElementById("avatarName").value.trim();

  if (!email || !password || !identityName || !avatarName) {
    showError("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with identity and avatar names
    await updateProfile(userCredential.user, {
      displayName: identityName + " (" + avatarName + ")",
    });
    showSuccess("Registro realizado com sucesso! Você já pode fazer login.");
    // Switch to login screen
    registrationScreen.style.display = "none";
    loginScreen.style.display = "block";
  } catch (error) {
    showError("Erro no registro: " + error.message);
  }
});

// Login user
loginBtn.addEventListener("click", async () => {
  clearMessages();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError("Por favor, preencha e-mail e senha.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showSuccess("Login realizado com sucesso!");
    // Hide login and registration screens after login
    loginScreen.style.display = "none";
    registrationScreen.style.display = "none";
    profileBtn.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
  } catch (error) {
    showError("Erro no login: " + error.message);
  }
});

// Password reset
sendPasswordResetBtn.addEventListener("click", async () => {
  clearMessages();
  const email = document.getElementById("loginEmail").value.trim();
  if (!email) {
    showError("Por favor, informe seu e-mail para recuperação de senha.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showSuccess("E-mail de recuperação enviado com sucesso.");
  } catch (error) {
    showError("Erro ao enviar e-mail de recuperação: " + error.message);
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  clearMessages();
  try {
    await signOut(auth);
    showSuccess("Logout realizado com sucesso.");
    profileBtn.style.display = "none";
    logoutBtn.style.display = "none";
    loginScreen.style.display = "block";
  } catch (error) {
    showError("Erro ao sair: " + error.message);
  }
});

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  successMessage.style.display = "none";
}

// Show success message
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
  errorMessage.style.display = "none";
}

// Monitor auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    loginScreen.style.display = "none";
    registrationScreen.style.display = "none";
    profileBtn.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";
  } else {
    // User is signed out
    profileBtn.style.display = "none";
    logoutBtn.style.display = "none";
    loginScreen.style.display = "block";
  }
});
