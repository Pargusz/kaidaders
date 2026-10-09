// Veri katmanı: her şey önce localStorage'a yazılır (çevrimdışı da çalışır),
// Google ile giriş yapılmışsa Firebase Realtime Database'e senkronlanır.
// Bulutta tek bir JSON metni tutulur: users/{uid} = { data, updatedAt, client }
// Ayrıca: profiles/{uid} (kullanıcı listesi + çevrimiçi durumu, sadece yönetici okur)
//         inbox/{uid}/{mesajId} (yöneticinin gönderdiği anlık mesajlar)

import { firebaseConfig } from './firebase-config.js';

const KEY = 'yks-planim-v1';
const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
const CLIENT = Math.random().toString(36).slice(2);
// Kurallar (database.rules.json) aynı adresi kontrol eder; buradaki liste sadece arayüz içindir.
export const ADMIN_EMAILS = ['gunduzpolat35@gmail.com'];

const listeners = { auth: [], remote: [], status: [], inbox: [] };
const emit = (evt, val) => listeners[evt].forEach(fn => fn(val));

let fb = null;          // { auth, db, a: auth modülü, d: database modülü }
let user = null;
let detach = null;
let pushTimer = null;
let pending = null;
let status = 'local';   // local | syncing | synced | error
let presenceOff = null;
let inboxOff = null;
let myConn = null;      // bu sekmenin çevrimiçi bağlantı kaydı

function setStatus(s) { status = s; emit('status', s); }

export const Store = {
  on(evt, fn) { listeners[evt].push(fn); },
  get user() { return user; },
  get status() { return status; },
  get ready() { return !!fb; },
  get isAdmin() {
    return !!user && user.emailVerified && ADMIN_EMAILS.includes((user.email || '').toLowerCase());
  },

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
        else {
          detach?.(); presenceOff?.(); inboxOff?.();
          detach = presenceOff = inboxOff = myConn = null;
          emit('inbox', []);
          setStatus('local');
        }
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
    if (!fb) return;
    if (myConn) await fb.d.remove(myConn).catch(() => {});
    await fb.a.signOut(fb.auth);
  },

  markRead(id) {
    if (!fb || !user) return;
    const { d, db } = fb;
    d.set(d.ref(db, `inbox/${user.uid}/${id}/readAt`), d.serverTimestamp())
      .catch(e => console.warn('Mesaj okundu olarak işaretlenemedi', e.message));
  },

  // Yönetici: kullanıcı listesini ve tüm mesaj kutularını canlı izler.
  watchAdmin(fn) {
    if (!fb || !this.isAdmin) return () => {};
    const { d, db } = fb;
    const data = { profiles: {}, inbox: {}, error: null, loaded: false };
    const fail = e => { data.error = e.message; fn({ ...data }); };
    const off1 = d.onValue(d.ref(db, 'profiles'), s => { data.profiles = s.val() || {}; data.loaded = true; data.error = null; fn({ ...data }); }, fail);
    const off2 = d.onValue(d.ref(db, 'inbox'), s => { data.inbox = s.val() || {}; fn({ ...data }); }, fail);
    return () => { off1(); off2(); };
  },

  // Aynı mesaj tek seferde (aynı kimlikle) her alıcının kutusuna yazılır.
  async sendMessage(uids, { title, text }) {
    if (!fb || !this.isAdmin) throw new Error('Yetki yok');
    const { d, db } = fb;
    const key = d.push(d.ref(db, 'inbox')).key;
    const msg = { title: title || '', text, at: d.serverTimestamp(), from: user.displayName || 'Yönetici' };
    const updates = {};
    uids.forEach(uid => { updates[`inbox/${uid}/${key}`] = msg; });
    await d.update(d.ref(db), updates);
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

  setupPresence(u, getLocal);
  listenInbox(u);

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

// Profil + çevrimiçi durumu. Her açık sekme connections altına bir kayıt ekler,
// sekme kapanınca (onDisconnect) kayıt silinir ve son görülme zamanı yazılır.
function setupPresence(u, getLocal) {
  const { d, db } = fb;
  const pRef = d.ref(db, `profiles/${u.uid}`);
  d.update(pRef, {
    name: u.displayName || '', email: u.email || '', photo: u.photoURL || '',
    appName: getLocal().settings?.name || '', lastSeen: d.serverTimestamp(),
  }).catch(e => console.warn('Profil yazılamadı (veritabanı kuralları güncel mi?)', e.message));
  presenceOff?.();
  presenceOff = d.onValue(d.ref(db, '.info/connected'), snap => {
    if (!snap.val()) return;
    myConn = d.push(d.child(pRef, 'connections'));
    d.onDisconnect(myConn).remove()
      .then(() => d.onDisconnect(d.child(pRef, 'lastSeen')).set(d.serverTimestamp()))
      .then(() => d.set(myConn, true))
      .catch(e => console.warn('Çevrimiçi durumu yazılamadı', e.message));
  });
}

function listenInbox(u) {
  const { d, db } = fb;
  inboxOff?.();
  inboxOff = d.onValue(d.ref(db, `inbox/${u.uid}`), snap => {
    const v = snap.val() || {};
    emit('inbox', Object.entries(v).map(([id, m]) => ({ id, ...m })).sort((a, b) => (a.at || 0) - (b.at || 0)));
  }, e => console.warn('Mesaj kutusu okunamadı', e.message));
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
