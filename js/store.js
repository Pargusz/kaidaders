// Veri katmanı: her şey önce localStorage'a yazılır (çevrimdışı da çalışır),
// Google ile giriş yapılmışsa Firebase Realtime Database'e senkronlanır.
// Bulutta tek bir JSON metni tutulur: users/{uid} = { data, updatedAt, client }

import { firebaseConfig } from './firebase-config.js';

const KEY = 'yks-planim-v1';
const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const CLIENT = Math.random().toString(36).slice(2);

const listeners = { auth: [], remote: [], status: [] };
const emit = (evt, val) => listeners[evt].forEach(fn => fn(val));

let fb = null;          // { auth, db, a: auth modülü, d: database modülü }
let user = null;
let detach = null;
let pushTimer = null;
let pending = null;
let status = 'local';   // local | syncing | synced | error

function setStatus(s) { status = s; emit('status', s); }

export const Store = {
  on(evt, fn) { listeners[evt].push(fn); },
  get user() { return user; },
  get status() { return status; },
  get ready() { return !!fb; },

  loadLocal() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
  },

  save(state) {
    state.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
    if (user) {
      pending = state;
      setStatus('syncing');
      clearTimeout(pushTimer);
      pushTimer = setTimeout(push, 800);
    }
  },

  async init(getLocal) {
    try {
      const [app, a, d] = await Promise.all([
        import(SDK + 'firebase-app.js'),
        import(SDK + 'firebase-auth.js'),
        import(SDK + 'firebase-database.js'),
      ]);
      const fApp = app.initializeApp(firebaseConfig);
      fb = { auth: a.getAuth(fApp), db: d.getDatabase(fApp), a, d };
      a.getRedirectResult(fb.auth).catch(() => {});
      a.onAuthStateChanged(fb.auth, u => {
        user = u;
        emit('auth', u);
        if (u) connect(u, getLocal);
        else { detach?.(); detach = null; setStatus('local'); }
      });
    } catch (e) {
      console.warn('Firebase yüklenemedi, yalnızca yerel kayıt kullanılacak.', e);
      emit('auth', null);
    }
  },

  async signIn() {
    if (!fb) throw new Error('Bulut bağlantısı yüklenemedi.');
    const { a, auth } = fb;
    const provider = new a.GoogleAuthProvider();
    try {
      await a.signInWithPopup(auth, provider);
    } catch (e) {
      if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(e.code)) {
        await a.signInWithRedirect(auth, provider);
      } else if (e.code !== 'auth/popup-closed-by-user' && e.code !== 'auth/cancelled-popup-request') {
        throw e;
      }
    }
  },

  async signOut() {
    if (fb) await fb.a.signOut(fb.auth);
  },
};

async function connect(u, getLocal) {
  const { d, db } = fb;
  const r = d.ref(db, `users/${u.uid}`);
  setStatus('syncing');
  try {
    const snap = await d.get(r);
    const remote = snap.val();
    const local = getLocal();
    // Bu cihaz bu hesapla ilk kez eşleşiyorsa buluttaki veri önceliklidir.
    const firstLink = local.syncUid !== u.uid;
    if (remote?.data && (firstLink || remote.updatedAt > (local.updatedAt || 0))) {
      const data = JSON.parse(remote.data);
      data.syncUid = u.uid;
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
      emit('remote', data);
      setStatus('synced');
    } else {
      local.syncUid = u.uid;
      pending = local;
      await push();
    }
  } catch (e) {
    console.error(e);
    setStatus('error');
  }

  detach?.();
  detach = d.onValue(r, snap => {
    const v = snap.val();
    if (!v?.data || v.client === CLIENT) return;
    const local = getLocal();
    if (v.updatedAt > (local.updatedAt || 0)) {
      const data = JSON.parse(v.data);
      data.syncUid = u.uid;
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
      emit('remote', data);
    }
  });
}

async function push() {
  if (!user || !pending || !fb) return;
  const state = pending;
  pending = null;
  state.syncUid = user.uid;
  try {
    await fb.d.set(fb.d.ref(fb.db, `users/${user.uid}`), {
      data: JSON.stringify(state),
      updatedAt: state.updatedAt || Date.now(),
      client: CLIENT,
    });
    if (!pending) setStatus('synced');
  } catch (e) {
    console.error(e);
    setStatus('error');
  }
}
