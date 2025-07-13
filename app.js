auth.onAuthStateChanged(user => {
  const path = window.location.pathname;
  if (user && path.includes('index.html')) {
    window.location = 'chat.html';
  } else if (!user && path.includes('chat.html')) {
    window.location = 'index.html';
  }
});

function login() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, pass)
    .catch(console.error);
}

function signup() {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => login())
    .catch(console.error);
}

function toggleForm() {
  const title = document.getElementById('auth-title');
  const btn = document.querySelector('#auth-form button');
  const link = document.querySelector('#auth-form p a');
  const mode = btn.innerText === 'ورود';
  title.innerText = mode ? 'ثبت‌نام' : 'ورود';
  btn.innerText = mode ? 'ثبت‌نام' : 'ورود';
  link.innerText = mode ? 'ورود' : 'ثبت‌نام';
  btn.onclick = mode ? signup : login;
}

function sendMessage() {
  const txt = document.getElementById('msg-input').value.trim();
  if (!txt) return;
  db.collection('messages').add({
    text: txt,
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  document.getElementById('msg-input').value = '';
}

db.collection('messages').orderBy('createdAt')
.onSnapshot(snapshot => {
  const box = document.getElementById('messages');
  if (!box) return;
  box.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.classList.add('message', data.uid === auth.currentUser.uid ? 'my-msg' : 'other-msg');
    div.textContent = data.email + ': ' + data.text;
    box.appendChild(div);
  });
});

function logout() {
  auth.signOut();
}