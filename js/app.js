import { SUBJECTS, ALANLAR, DENEME, MOTIVASYON } from './data.js';
import { Store } from './store.js';

// ---------------------------------------------------------------- yardımcılar
const $ = (s, r = document) => r.querySelector(s);
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / 864e5);
const today = () => ymd(new Date());
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 10);

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const GUN_KISA = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const fmt = s => { const d = parse(s); return `${d.getDate()} ${AYLAR[d.getMonth()].slice(0, 3)}`; };
const fmtLong = s => { const d = parse(s); return `${d.getDate()} ${AYLAR[d.getMonth()]} ${GUNLER[d.getDay()]}`; };

const SUB = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));
const topicInfo = id => {
  const [sid, i] = id.split(':');
  const sub = SUB[sid];
  return sub && sub.topics[+i] ? { id, sub, name: sub.topics[+i] } : null;
};
const REV = [1, 7, 30];
const REV_LABEL = { 1: 'Ertesi gün tekrarı', 7: '1 hafta tekrarı', 30: '1 ay tekrarı' };

const I = {
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V8M18 17v-9"/>',
  gear: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  pause: '<path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z"/>',
  reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  skip: '<path d="m5 4 10 8-10 8zM19 5v14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z"/>',
  flame: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-2.2 2-3.1 3.9-2 6 .5 1 1 1.6 1 3a2.5 2.5 0 0 1-5 0c-.6 1-1 2.1-1 3.3A7 7 0 0 0 12 22z"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  down: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  up: '<path d="M12 15V3M7 8l5-5 5 5M5 21h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
};
const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

// ---------------------------------------------------------------- durum
function defaultState() {
  return {
    v: 1,
    onboarded: false,
    settings: {
      name: '', alan: 'say', start: today(), exam: '2027-06-19', mode: 'custom',
      perDay: 0, denemeDay: 0, reviewWeeks: 6, disabled: [], theme: 'auto', pomo: 25,
    },
    weekly: {},    // haftanın günü (0=Pazar) -> [{ id, sub, text, from, until }]
    wdone: {},     // `${gün}_${id}` -> tiklendiği gün
    wskip: {},     // `${gün}_${id}` -> o gün için kaldırıldı
    plan: {},      // 'YYYY-AA-GG' -> [konuId] (yalnızca otomatik planda)
    done: {},      // konuId -> bitirildiği gün
    reviews: {},   // `${konuId}@${gün}` -> yapıldığı gün
    special: {},   // gün -> deneme/tekrar günü tamamlandı
    custom: {},    // gün -> [{ id, sub, text, done }]
    log: {},       // gün -> { q, min, pomo }
    notes: {},     // gün -> metin
    denemeler: [], // { id, type, date, name, s: { bölüm: { d, y } } }
  };
}

function migrate(s) {
  const def = defaultState();
  if (!s || typeof s !== 'object') return def;
  const out = { ...def, ...s, settings: { ...def.settings, ...(s.settings || {}) } };
  if (!ALANLAR[out.settings.alan]) out.settings.alan = 'say';
  return out;
}

let state = migrate(Store.loadLocal());
let ctx = {};
const ui = {
  view: 'bugun', month: today().slice(0, 7), sel: today(),
  konuTab: 'TYT', konuQ: '', denemeTab: 'TYT', open: {},
};

function commit(opts = {}) {
  Store.save(state);
  if (opts.render !== false) render();
}

// ---------------------------------------------------------------- plan
function activeSubjects() {
  const s = state.settings;
  const ayt = ALANLAR[s.alan].ayt;
  return SUBJECTS.filter(sub => (sub.exam === 'TYT' || ayt.includes(sub.id)) && !s.disabled.includes(sub.id));
}
const subjectIds = sub => sub.topics.map((_, i) => `${sub.id}:${i}`);
const isAuto = () => state.settings.mode === 'auto';
const planEnd = () => addDays(state.settings.exam, -state.settings.reviewWeeks * 7);

// Kalan konuları, her ders aynı anda bitecek şekilde iç içe geçirip
// `from` gününden tekrar dönemine kadarki çalışma günlerine yayar.
function buildPlan(from) {
  const s = state.settings;
  const items = [];
  activeSubjects().forEach((sub, si) => {
    const pend = subjectIds(sub).filter(id => !state.done[id]);
    pend.forEach((id, k) => items.push({ id, pos: (k + 0.5) / pend.length, si }));
  });
  items.sort((a, b) => a.pos - b.pos || a.si - b.si);

  const end = planEnd();
  const days = [];
  for (let d = from; d < end; d = addDays(d, 1)) if (parse(d).getDay() !== s.denemeDay) days.push(d);
  if (!days.length) days.push(from);

  // Bitirilmiş konular olduğu günde kalır, yalnızca bitmemişler yeniden dağıtılır.
  const plan = {};
  for (const [d, ids] of Object.entries(state.plan)) {
    const kept = ids.filter(id => state.done[id]);
    if (kept.length) plan[d] = kept;
  }
  const per = s.perDay ? Math.max(s.perDay, Math.ceil(items.length / days.length)) : 0;
  items.forEach((it, i) => {
    const di = per ? Math.floor(i / per) : Math.floor(i * days.length / items.length);
    (plan[days[Math.min(di, days.length - 1)]] ||= []).push(it.id);
  });
  state.plan = plan;
}

// Otomatik planın konuları ve aralıklı tekrarları yalnızca otomatik modda görünür.
function buildCtx() {
  const rev = {}, planIdx = {};
  if (isAuto()) {
    for (const [id, d] of Object.entries(state.done)) {
      if (!topicInfo(id)) continue;
      for (const k of REV) (rev[addDays(d, k)] ||= []).push({ id, k, key: `${id}@${k}` });
    }
    for (const [d, ids] of Object.entries(state.plan)) ids.forEach(id => { planIdx[id] = d; });
  }
  ctx = { rev, planIdx, end: planEnd(), active: activeSubjects() };
}

// Her hafta tekrarlanan dersler: eklendiği günden itibaren (ve kaldırılana kadar) görünür.
function weeklyFor(d) {
  if (d >= state.settings.exam) return [];
  return (state.weekly[parse(d).getDay()] || [])
    .filter(w => d >= w.from && (!w.until || d < w.until) && !state.wskip[`${d}_${w.id}`]);
}

function dayData(d) {
  const s = state.settings, auto = isAuto();
  const topics = auto ? (state.plan[d] || []).filter(topicInfo) : [];
  const custom = state.custom[d] || [];
  const weekly = weeklyFor(d);
  const reviews = ctx.rev[d] || [];
  let special = null;
  if (d === s.exam) special = { text: 'YKS günü — başarılar!', exam: true };
  else if (auto && d >= s.start && d < s.exam) {
    if (d >= ctx.end) special = { text: 'Genel tekrar + deneme günü', sub: 'Bir deneme çöz, yanlışlarını konu konu incele.' };
    else if (parse(d).getDay() === s.denemeDay) special = { text: 'Deneme günü', sub: 'Bir deneme çöz, yanlışlarını incele, haftanın konularını tekrar et.' };
  }
  const hasSpecial = special && !special.exam;
  const total = topics.length + weekly.length + custom.length + reviews.length + (hasSpecial ? 1 : 0);
  const done = topics.filter(id => state.done[id]).length
    + weekly.filter(w => state.wdone[`${d}_${w.id}`]).length
    + custom.filter(c => c.done).length
    + reviews.filter(r => state.reviews[r.key]).length
    + (hasSpecial && state.special[d] ? 1 : 0);
  return { d, topics, weekly, custom, reviews, special, total, done };
}

// Takvim hücresi için kısa etiketler
function dayChips(dd) {
  const out = dd.topics.map(id => { const ti = topicInfo(id); return { label: ti.name, color: ti.sub.color, done: !!state.done[id] }; });
  dd.weekly.forEach(w => out.push({ label: SUB[w.sub]?.name || w.text, color: SUB[w.sub]?.color || 'var(--muted)', done: !!state.wdone[`${dd.d}_${w.id}`] }));
  dd.custom.forEach(c => out.push({ label: SUB[c.sub]?.name || c.text, color: SUB[c.sub]?.color || 'var(--muted)', done: !!c.done }));
  return out;
}

function overdue() {
  if (!isAuto()) return [];
  const t = today(), out = [];
  for (const [d, ids] of Object.entries(state.plan)) {
    if (d >= t) continue;
    ids.forEach(id => { if (!state.done[id] && topicInfo(id)) out.push({ id, d }); });
  }
  return out.sort((a, b) => a.d.localeCompare(b.d));
}

// Bir günün etkinlik puanı (ısı haritası ve seri için)
function activity() {
  const a = {};
  const add = (d, n) => { if (d) a[d] = (a[d] || 0) + n; };
  Object.values(state.done).forEach(d => add(d, 1));
  Object.values(state.reviews).forEach(d => add(d, 0.5));
  Object.entries(state.special).forEach(([d, v]) => v && add(d, 1));
  Object.entries(state.custom).forEach(([d, list]) => add(d, list.filter(c => c.done).length));
  Object.values(state.wdone).forEach(d => add(d, 1));
  Object.entries(state.log).forEach(([d, l]) => add(d, (l.q || 0) / 40 + (l.min || 0) / 60));
  return a;
}

function streaks(act) {
  let d = today();
  if (!act[d]) d = addDays(d, -1);
  let cur = 0;
  while (act[d]) { cur++; d = addDays(d, -1); }
  const days = Object.keys(act).filter(k => act[k] > 0).sort();
  let best = 0, run = 0, prev = null;
  for (const k of days) { run = prev && diffDays(prev, k) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = k; }
  return { cur, best: Math.max(best, cur) };
}

// ---------------------------------------------------------------- parçalar
const empty = (title, sub = '') => `<div class="empty"><b>${title}</b>${sub ? `<span>${sub}</span>` : ''}</div>`;

function ring(pct, label, size = 'lg') {
  return `<div class="ring ring-${size}" style="--p:${pct}"><div><b>${pct}%</b>${label ? `<small>${label}</small>` : ''}</div></div>`;
}

function topicCard(id, d) {
  const ti = topicInfo(id), done = !!state.done[id];
  return `<div class="task ${done ? 'is-done' : ''}" style="--c:${ti.sub.color}">
    <button class="check" data-act="topic" data-id="${id}" aria-pressed="${done}" aria-label="${esc(ti.name)} tamamlandı">${ic('check')}</button>
    <div class="task-main"><span class="task-tag">${ti.sub.exam} · ${esc(ti.sub.name)}</span><span class="task-title">${esc(ti.name)}</span></div>
    ${!done && d ? `<button class="icon-btn" data-act="postpone" data-id="${id}" data-date="${d}" title="Yarına ertele" aria-label="Yarına ertele">${ic('arrow')}</button>` : ''}
  </div>`;
}

function reviewCard(r) {
  const ti = topicInfo(r.id), done = !!state.reviews[r.key];
  return `<div class="task task-review ${done ? 'is-done' : ''}" style="--c:${ti.sub.color}">
    <button class="check" data-act="review" data-key="${r.key}" aria-pressed="${done}" aria-label="Tekrar yapıldı">${ic('check')}</button>
    <div class="task-main"><span class="task-tag">${ic('repeat')} ${REV_LABEL[r.k]} · ${esc(ti.sub.name)}</span><span class="task-title">${esc(ti.name)}</span></div>
  </div>`;
}

// Ders seçildiyse ders adı başlık olur, not varsa not başlığa geçer.
function subLabel(subId, text) {
  const sub = SUB[subId];
  if (!sub) return { color: 'var(--muted)', tag: 'Görev', title: text };
  return { color: sub.color, tag: text ? `${sub.exam} · ${sub.name}` : sub.exam, title: text || sub.name };
}

function customCard(c, d) {
  const l = subLabel(c.sub, c.text);
  return `<div class="task ${c.done ? 'is-done' : ''}" style="--c:${l.color}">
    <button class="check" data-act="custom" data-id="${c.id}" data-date="${d}" aria-pressed="${!!c.done}" aria-label="${esc(l.title)} tamamlandı">${ic('check')}</button>
    <div class="task-main"><span class="task-tag">${esc(l.tag)}</span><span class="task-title">${esc(l.title)}</span></div>
    <button class="icon-btn" data-act="del-custom" data-id="${c.id}" data-date="${d}" aria-label="Sil">${ic('x')}</button>
  </div>`;
}

function weeklyCard(w, d) {
  const l = subLabel(w.sub, w.text), key = `${d}_${w.id}`, done = !!state.wdone[key];
  return `<div class="task ${done ? 'is-done' : ''}" style="--c:${l.color}">
    <button class="check" data-act="wtoggle" data-key="${key}" aria-pressed="${done}" aria-label="${esc(l.title)} tamamlandı">${ic('check')}</button>
    <div class="task-main"><span class="task-tag">${esc(l.tag)} <span class="rep" title="Her hafta tekrar ediyor">${ic('repeat')}</span></span><span class="task-title">${esc(l.title)}</span></div>
    <button class="icon-btn" data-act="wdel" data-id="${w.id}" data-date="${d}" aria-label="Sil">${ic('x')}</button>
  </div>`;
}

function subjectOptions() {
  const group = exam => ctx.active.filter(s => s.exam === exam)
    .map(s => `<option value="${s.id}">${exam} ${esc(s.name)}</option>`).join('');
  return `<option value="">Ders seç</option><optgroup label="TYT">${group('TYT')}</optgroup><optgroup label="AYT">${group('AYT')}</optgroup>`;
}

function specialCard(dd) {
  if (dd.special.exam) return `<div class="task task-exam"><div class="task-main"><span class="task-title">${ic('star')} ${dd.special.text}</span></div></div>`;
  const done = !!state.special[dd.d];
  return `<div class="task task-special ${done ? 'is-done' : ''}">
    <button class="check" data-act="special" data-date="${dd.d}" aria-pressed="${done}" aria-label="Tamamlandı">${ic('check')}</button>
    <div class="task-main"><span class="task-tag">${ic('target')} ${dd.special.text}</span><span class="task-title">${dd.special.sub}</span></div>
    <a class="pill-btn" href="#deneme">Net gir</a>
  </div>`;
}

function taskList(dd) {
  let h = '';
  if (dd.special) h += specialCard(dd);
  dd.topics.forEach(id => { h += topicCard(id, dd.d); });
  dd.weekly.forEach(w => { h += weeklyCard(w, dd.d); });
  dd.custom.forEach(c => { h += customCard(c, dd.d); });
  dd.reviews.forEach(r => { h += reviewCard(r); });
  if (!h) h = empty('Bu güne ders eklenmedi', 'Aşağıdan çalışacağın dersi seçip ekle.');
  const gun = GUNLER[parse(dd.d).getDay()].toLocaleLowerCase('tr');
  return `<div class="tasks">${h}</div>
    <form class="add-task" data-form="custom" data-date="${dd.d}">
      <select name="sub" aria-label="Ders">${subjectOptions()}</select>
      <input name="text" placeholder="Not (ör. 2 saat, 40 soru, tekrar)" autocomplete="off" maxlength="120">
      <label class="rep-toggle"><input type="checkbox" name="weekly"><span>${ic('repeat')} Her ${gun} tekrarla</span></label>
      <button class="btn btn-primary">${ic('plus')} Ekle</button>
    </form>`;
}

function noteBox(d) {
  return `<textarea class="note" data-note="${d}" placeholder="Bugün neler öğrendin, nerede zorlandın?" rows="3">${esc(state.notes[d] || '')}</textarea>`;
}

// ---------------------------------------------------------------- görünümler
const VIEWS = {};

VIEWS.bugun = () => {
  const s = state.settings, t = today(), dd = dayData(t);
  const pct = dd.total ? Math.round(dd.done / dd.total * 100) : 0;
  const left = Math.max(0, diffDays(t, s.exam));
  const ov = overdue();
  const all = ctx.active.flatMap(subjectIds);
  const doneN = all.filter(id => state.done[id]).length;
  const st = streaks(activity());
  const log = state.log[t] || {};
  const motto = MOTIVASYON[parse(t).getDate() % MOTIVASYON.length];
  const before = isAuto() && t < s.start;

  return `
  <section class="hero">
    <div class="hero-text">
      <p class="eyebrow">${fmtLong(t)}</p>
      <h1>${s.name ? `Merhaba ${esc(s.name)}` : 'Merhaba'}</h1>
      <p class="hero-sub">${motto}</p>
    </div>
    ${ring(pct, 'bugün')}
    <div class="hero-stats">
      <div><b>${left}</b><span>gün kaldı</span></div>
      <div><b>${ic('flame', 'flame')}${st.cur}</b><span>gün seri</span></div>
      <div><b>${doneN}<small>/${all.length}</small></b><span>konu bitti</span></div>
    </div>
  </section>

  <div class="grid-2">
    <div class="col">
      <section class="card">
        <div class="card-head">
          <h2>${isAuto() ? 'Bugünün planı' : 'Bugünün dersleri'}</h2>
          <span class="count">${dd.done}/${dd.total}</span>
        </div>
        ${before ? `<p class="hint">Planın ${fmtLong(s.start)} günü başlıyor. O zamana kadar kendi görevlerini ekleyebilirsin.</p>` : ''}
        ${taskList(dd)}
      </section>

      ${ov.length ? `
      <section class="card card-warn">
        <div class="card-head">
          <h2>Geciken konular <span class="count">${ov.length}</span></h2>
          <button class="btn btn-soft btn-sm" data-act="rebalance">Planı yeniden dengele</button>
        </div>
        <div class="tasks">
          ${ov.slice(0, 6).map(o => {
            const ti = topicInfo(o.id);
            return `<div class="task" style="--c:${ti.sub.color}">
              <button class="check" data-act="topic" data-id="${o.id}" aria-label="Tamamlandı">${ic('check')}</button>
              <div class="task-main"><span class="task-tag">${fmt(o.d)} · ${ti.sub.exam} ${esc(ti.sub.name)}</span><span class="task-title">${esc(ti.name)}</span></div>
              <button class="pill-btn" data-act="pull" data-id="${o.id}" data-date="${o.d}">Bugüne al</button>
            </div>`;
          }).join('')}
        </div>
        ${ov.length > 6 ? `<p class="hint">+${ov.length - 6} konu daha. "Planı yeniden dengele" hepsini kalan günlere dağıtır.</p>` : ''}
      </section>` : ''}
    </div>

    <div class="col">
      ${pomoCard(log)}
      <section class="card">
        <div class="card-head"><h2>Bugün çözülen soru</h2></div>
        <div class="counter">
          <button class="btn btn-soft" data-act="q" data-n="-10">−10</button>
          <output><b>${log.q || 0}</b><span>soru</span></output>
          <button class="btn btn-soft" data-act="q" data-n="10">+10</button>
        </div>
        <div class="quick">
          ${[20, 40, 60, 100].map(n => `<button class="chip" data-act="q" data-n="${n}">+${n}</button>`).join('')}
        </div>
      </section>
      <section class="card">
        <div class="card-head"><h2>Günün notu</h2></div>
        ${noteBox(t)}
      </section>
    </div>
  </div>`;
};

// ---- pomodoro
const pomo = { mode: 'focus', left: null, running: false, endAt: 0, timer: null };
const pomoLen = () => (pomo.mode === 'focus' ? state.settings.pomo : state.settings.pomo === 50 ? 10 : 5) * 60;
if (pomo.left == null) pomo.left = pomoLen();

function pomoCard(log) {
  return `<section class="card pomo ${pomo.mode === 'break' ? 'is-break' : ''}">
    <div class="card-head">
      <h2>Odak sayacı</h2>
      <div class="seg" role="group" aria-label="Süre">
        ${[25, 50].map(n => `<button class="${state.settings.pomo === n ? 'on' : ''}" data-act="pomo-len" data-n="${n}">${n}/${n === 50 ? 10 : 5}</button>`).join('')}
      </div>
    </div>
    <div class="pomo-body">
      <div class="pomo-dial">
        <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="track"/><circle id="pomo-arc" cx="60" cy="60" r="54" class="arc"/></svg>
        <div><b id="pomo-time">--:--</b><span id="pomo-mode">${pomo.mode === 'focus' ? 'Odak' : 'Mola'}</span></div>
      </div>
      <div class="pomo-side">
        <div class="pomo-btns">
          <button class="btn btn-primary" id="pomo-btn" data-act="pomo-toggle"></button>
          <button class="btn btn-soft" data-act="pomo-reset" aria-label="Sıfırla" title="Sıfırla">${ic('reset')}</button>
          <button class="btn btn-soft" data-act="pomo-skip" aria-label="Atla" title="Atla">${ic('skip')}</button>
        </div>
        <p class="hint">Bugün <b>${log.pomo || 0}</b> pomodoro · <b>${log.min || 0}</b> dk</p>
      </div>
    </div>
  </section>`;
}

function paintPomo() {
  const m = Math.floor(pomo.left / 60), s = pomo.left % 60;
  const txt = `${pad(m)}:${pad(s)}`;
  const time = $('#pomo-time');
  if (time) {
    time.textContent = txt;
    const arc = $('#pomo-arc');
    const C = 2 * Math.PI * 54;
    arc.style.strokeDasharray = C;
    arc.style.strokeDashoffset = C * (pomo.left / pomoLen());
    $('#pomo-btn').innerHTML = pomo.running ? `${ic('pause')} Duraklat` : `${ic('play')} ${pomo.left < pomoLen() ? 'Devam' : 'Başla'}`;
    $('#pomo-mode').textContent = pomo.mode === 'focus' ? 'Odak' : 'Mola';
  }
  const mini = $('#mini-pomo');
  mini.hidden = !(pomo.running && ui.view !== 'bugun');
  mini.innerHTML = `${ic(pomo.mode === 'focus' ? 'target' : 'repeat')} ${txt}`;
  document.title = pomo.running ? `${txt} · YKS Planım` : 'YKS Planım';
}

function pomoTick() {
  pomo.left = Math.max(0, Math.round((pomo.endAt - Date.now()) / 1000));
  if (pomo.left === 0) pomoComplete();
  paintPomo();
}

function pomoStop() { pomo.running = false; clearInterval(pomo.timer); }

function pomoComplete(skipped = false) {
  pomoStop();
  if (pomo.mode === 'focus' && !skipped) {
    const t = today(), l = (state.log[t] ||= {});
    l.min = (l.min || 0) + state.settings.pomo;
    l.pomo = (l.pomo || 0) + 1;
    beep();
    notify('Odak bitti! Kısa bir mola ver.');
    toast(`${state.settings.pomo} dk odak tamamlandı. Mola zamanı!`);
    Store.save(state);
  } else if (!skipped) {
    beep();
    notify('Mola bitti, hadi devam!');
  }
  pomo.mode = pomo.mode === 'focus' ? 'break' : 'focus';
  pomo.left = pomoLen();
  if (ui.view === 'bugun') render();
}

function beep() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach(t => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.2, ac.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t + 0.2);
      o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.2);
    });
  } catch {}
}

function notify(msg) {
  try { if (Notification.permission === 'granted' && document.hidden) new Notification('YKS Planım', { body: msg }); } catch {}
}

// ---- takvim
VIEWS.takvim = () => {
  const [y, m] = ui.month.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const offset = (first.getDay() + 6) % 7;
  const start = ymd(new Date(y, m - 1, 1 - offset));
  const t = today(), s = state.settings;
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i), dd = dayData(d), dt = parse(d);
    const cls = ['cell'];
    if (dt.getMonth() !== m - 1) cls.push('other');
    if (d === t) cls.push('today');
    if (d === ui.sel) cls.push('sel');
    if (d === s.exam) cls.push('exam');
    if (dd.special && !dd.special.exam) cls.push('special');
    if (dd.total && dd.done === dd.total) cls.push('full');
    else if (d < t && (isAuto() ? dd.topics.some(id => !state.done[id]) : dd.done < dd.total)) cls.push('late');
    const items = dayChips(dd);
    const chips = items.slice(0, 3).map(c => `<span class="chip-mini ${c.done ? 'done' : ''}" style="--c:${c.color}">${esc(c.label)}</span>`).join('');
    const dots = items.map(c => `<i style="--c:${c.color}" class="${c.done ? 'done' : ''}"></i>`).join('');
    const pct = dd.total ? dd.done / dd.total * 100 : 0;
    cells += `<button class="${cls.join(' ')}" data-act="sel-day" data-date="${d}" aria-label="${fmtLong(d)}, ${dd.done}/${dd.total} görev">
      <span class="num">${dt.getDate()}</span>
      ${d === s.exam ? '<span class="badge-exam">YKS</span>' : dd.special && !dd.special.exam ? `<span class="badge-sp">${dd.special.text.startsWith('Genel') ? 'Tekrar' : 'Deneme'}</span>` : ''}
      <span class="chips">${chips}${items.length > 3 ? `<span class="more">+${items.length - 3}</span>` : ''}</span>
      <span class="dots">${dots}</span>
      ${dd.total ? `<span class="bar"><i style="width:${pct}%"></i></span>` : ''}
    </button>`;
  }
  const sel = dayData(ui.sel);
  return `
  <div class="cal-layout">
    <section class="card cal-card">
      <div class="cal-head">
        <button class="icon-btn" data-act="month" data-n="-1" aria-label="Önceki ay">${ic('left')}</button>
        <h2>${AYLAR[m - 1]} ${y}</h2>
        <button class="icon-btn" data-act="month" data-n="1" aria-label="Sonraki ay">${ic('right')}</button>
        <button class="btn btn-soft btn-sm" data-act="cal-today">Bugün</button>
      </div>
      <div class="cal-grid">
        ${GUN_KISA.map(g => `<div class="dow">${g}</div>`).join('')}
        ${cells}
      </div>
      <div class="legend">
        <span><i class="lg-full"></i>Tamamlandı</span><span><i class="lg-late"></i>Yarım kalan</span>
        ${isAuto() ? '<span><i class="lg-sp"></i>Deneme / tekrar</span>' : `<span>${ic('repeat', 'lg-ic')} Her hafta tekrar eden</span>`}
      </div>
      ${isAuto() ? '' : '<p class="hint">Bir güne dokun, altta açılan yerden o güne ders ekle.</p>'}
    </section>
    <section class="card day-card" id="day-detail">
      <div class="card-head">
        <div><p class="eyebrow">${ui.sel === t ? 'Bugün' : diffDays(t, ui.sel) === 1 ? 'Yarın' : diffDays(t, ui.sel) === -1 ? 'Dün' : ''}</p><h2>${fmtLong(ui.sel)}</h2></div>
        <span class="count">${sel.done}/${sel.total}</span>
      </div>
      ${taskList(sel)}
      <div class="day-note">${noteBox(ui.sel)}</div>
    </section>
  </div>`;
};

// ---- konular
VIEWS.konular = () => {
  const s = state.settings;
  const tabs = [['TYT', 'TYT'], ['AYT', `AYT · ${ALANLAR[s.alan].name}`]];
  const subs = ctx.active.filter(sub => sub.exam === ui.konuTab);
  const ids = subs.flatMap(subjectIds);
  const doneN = ids.filter(id => state.done[id]).length;
  const pct = ids.length ? Math.round(doneN / ids.length * 100) : 0;
  return `
  <section class="card konu-top">
    <div class="seg seg-lg" role="tablist">
      ${tabs.map(([k, l]) => `<button role="tab" class="${ui.konuTab === k ? 'on' : ''}" data-act="konu-tab" data-tab="${k}">${l}</button>`).join('')}
    </div>
    <div class="konu-sum">
      ${ring(pct, '', 'sm')}
      <div><b>${doneN} / ${ids.length} konu</b><span class="hint">Konuya dokunarak bitirdiğini işaretle.${isAuto() ? ' Tarih etiketi seni takvimdeki gününe götürür.' : ''}</span></div>
    </div>
    <label class="search">${ic('search')}<input type="search" data-input="konuQ" placeholder="Konu ara…" value="${esc(ui.konuQ)}"></label>
  </section>
  <div id="konu-list" class="subjects">${konuList(subs)}</div>`;
};

function konuList(subs) {
  const q = ui.konuQ.trim().toLocaleLowerCase('tr');
  const t = today();
  let h = '';
  for (const sub of subs) {
    const rows = subjectIds(sub).map(id => ({ id, name: topicInfo(id).name }))
      .filter(r => !q || r.name.toLocaleLowerCase('tr').includes(q) || sub.name.toLocaleLowerCase('tr').includes(q));
    if (!rows.length) continue;
    const all = subjectIds(sub), dn = all.filter(id => state.done[id]).length;
    const open = q || ui.open[sub.id];
    h += `<details class="subject" style="--c:${sub.color}" data-sub="${sub.id}" ${open ? 'open' : ''}>
      <summary>
        <span class="sub-dot"></span>
        <span class="sub-name">${esc(sub.name)}</span>
        <span class="sub-count">${dn}/${all.length}</span>
        <span class="sub-bar"><i style="width:${dn / all.length * 100}%"></i></span>
        ${ic('right', 'chev')}
      </summary>
      <div class="trows">
        ${rows.map(r => {
          const done = state.done[r.id], pd = ctx.planIdx[r.id];
          const meta = done ? `<span class="tdate ok">${ic('check')} ${fmt(done)}</span>`
            : pd ? `<button class="tdate ${pd < t ? 'late' : ''}" data-act="goto" data-date="${pd}">${fmt(pd)}</button>` : '';
          return `<div class="trow ${done ? 'is-done' : ''}">
            <button class="check check-sm" data-act="topic" data-id="${r.id}" aria-pressed="${!!done}" aria-label="${esc(r.name)}">${ic('check')}</button>
            <span class="tname">${esc(r.name)}</span>${meta}
          </div>`;
        }).join('')}
      </div>
    </details>`;
  }
  return h || empty('Sonuç bulunamadı', 'Farklı bir kelime dene.');
}

// ---- denemeler
const denemeTypes = () => [['TYT', 'TYT'], [`AYT-${state.settings.alan}`, `AYT · ${ALANLAR[state.settings.alan].name}`]];
const netOf = (type, s) => DENEME[type].reduce((sum, [k]) => sum + ((s[k]?.d || 0) - (s[k]?.y || 0) / 4), 0);
const r2 = n => Math.round(n * 100) / 100;

VIEWS.deneme = () => {
  const types = denemeTypes();
  if (!types.some(([k]) => k === ui.denemeTab)) ui.denemeTab = 'TYT';
  const type = ui.denemeTab;
  const list = state.denemeler.filter(x => x.type === type).sort((a, b) => a.date.localeCompare(b.date));
  const nets = list.map(x => netOf(type, x.s));
  const max = DENEME[type].reduce((a, [, , n]) => a + n, 0);
  const last = nets.at(-1), prev = nets.at(-2);
  const best = nets.length ? Math.max(...nets) : null;
  const avg = nets.length ? nets.reduce((a, b) => a + b, 0) / nets.length : null;
  return `
  <section class="card">
    <div class="card-head">
      <div class="seg seg-lg" role="tablist">
        ${types.map(([k, l]) => `<button class="${type === k ? 'on' : ''}" data-act="deneme-tab" data-tab="${k}">${l}</button>`).join('')}
      </div>
      <button class="btn btn-primary" data-act="deneme-new">${ic('plus')} Deneme ekle</button>
    </div>
    <div class="kpis">
      <div><span>Son net</span><b>${last != null ? r2(last) : '—'}</b>${last != null && prev != null ? `<em class="${last >= prev ? 'up' : 'down'}">${last >= prev ? '+' : ''}${r2(last - prev)}</em>` : ''}</div>
      <div><span>En iyi</span><b>${best != null ? r2(best) : '—'}</b></div>
      <div><span>Ortalama</span><b>${avg != null ? r2(avg) : '—'}</b></div>
      <div><span>Deneme</span><b>${list.length}</b></div>
    </div>
    ${list.length >= 2 ? lineChart(list.map((x, i) => ({ label: fmt(x.date), v: nets[i] })), max) : `<p class="hint">Grafik için en az 2 deneme gir. Netler (doğru − yanlış/4) otomatik hesaplanır.</p>`}
  </section>
  <section class="card">
    <div class="card-head"><h2>Deneme geçmişi</h2></div>
    ${list.length ? `<div class="dlist">${list.slice().reverse().map(x => denemeRow(x)).join('')}</div>` : empty('Henüz deneme yok', '"Deneme ekle" ile ilk denemeni gir.')}
  </section>`;
};

function denemeRow(x) {
  const secs = DENEME[x.type];
  return `<div class="drow">
    <div class="drow-head">
      <div><b>${esc(x.name || 'Deneme')}</b><span class="hint">${fmtLong(x.date)}</span></div>
      <div class="drow-net"><b>${r2(netOf(x.type, x.s))}</b><span>net</span></div>
      <button class="icon-btn" data-act="deneme-del" data-id="${x.id}" aria-label="Denemeyi sil">${ic('trash')}</button>
    </div>
    <div class="drow-secs">${secs.map(([k, l]) => `<span><em>${l}</em>${r2((x.s[k]?.d || 0) - (x.s[k]?.y || 0) / 4)}</span>`).join('')}</div>
  </div>`;
}

function lineChart(pts, max) {
  const W = innerWidth < 600 ? 360 : 640, H = innerWidth < 600 ? 200 : 220, P = { l: 30, r: 14, t: 14, b: 26 };
  const lo = Math.max(0, Math.floor(Math.min(...pts.map(p => p.v)) / 10) * 10 - 10);
  const hi = Math.min(max, Math.ceil(Math.max(...pts.map(p => p.v)) / 10) * 10 + 10);
  const x = i => P.l + (pts.length === 1 ? 0 : i * (W - P.l - P.r) / (pts.length - 1));
  const yv = v => P.t + (H - P.t - P.b) * (1 - (v - lo) / (hi - lo || 1));
  const ticks = [lo, (lo + hi) / 2, hi];
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${yv(p.v).toFixed(1)}`).join('');
  const area = `${path}L${x(pts.length - 1)},${H - P.b}L${x(0)},${H - P.b}Z`;
  const step = Math.ceil(pts.length / 8);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Net grafiği">
    ${ticks.map(v => `<line x1="${P.l}" x2="${W - P.r}" y1="${yv(v)}" y2="${yv(v)}" class="grid"/><text x="${P.l - 8}" y="${yv(v) + 4}" text-anchor="end">${Math.round(v)}</text>`).join('')}
    <path d="${area}" class="area"/><path d="${path}" class="line"/>
    ${pts.map((p, i) => `<circle cx="${x(i)}" cy="${yv(p.v)}" r="4" class="pt"><title>${p.label}: ${r2(p.v)} net</title></circle>
      ${i % step === 0 || i === pts.length - 1 ? `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${p.label}</text>` : ''}`).join('')}
  </svg>`;
}

function openDenemeForm() {
  const type = ui.denemeTab;
  const secs = DENEME[type];
  openModal(`
    <form data-form="deneme" class="form">
      <div class="modal-head"><h2>${type === 'TYT' ? 'TYT' : 'AYT'} denemesi ekle</h2><button type="button" class="icon-btn" data-act="close" aria-label="Kapat">${ic('x')}</button></div>
      <div class="row-2">
        <label class="field"><span>Deneme adı</span><input name="name" placeholder="ör. 3D Türkiye Geneli" maxlength="60"></label>
        <label class="field"><span>Tarih</span><input type="date" name="date" value="${today()}" required></label>
      </div>
      <div class="dtable">
        <div class="dt-h"><span>Ders</span><span>Doğru</span><span>Yanlış</span><span>Net</span></div>
        ${secs.map(([k, l, n]) => `<div class="dt-r" data-sec="${k}">
          <span>${l}<small>${n} soru</small></span>
          <input type="number" inputmode="numeric" min="0" max="${n}" name="${k}_d" placeholder="0">
          <input type="number" inputmode="numeric" min="0" max="${n}" name="${k}_y" placeholder="0">
          <output>0</output>
        </div>`).join('')}
        <div class="dt-total"><span>Toplam net</span><output id="dt-total">0</output></div>
      </div>
      <button class="btn btn-primary btn-block">Kaydet</button>
    </form>`);
}

// ---- istatistik
VIEWS.istatistik = () => {
  const act = activity(), st = streaks(act), t = today();
  const all = ctx.active.flatMap(subjectIds);
  const doneN = all.filter(id => state.done[id]).length;
  const totalQ = Object.values(state.log).reduce((a, l) => a + (l.q || 0), 0);
  const totalMin = Object.values(state.log).reduce((a, l) => a + (l.min || 0), 0);
  const plannedSoFar = Object.entries(state.plan).filter(([d]) => d <= t).reduce((a, [, ids]) => a + ids.filter(topicInfo).length, 0);
  const plannedDone = Object.entries(state.plan).filter(([d]) => d <= t).reduce((a, [, ids]) => a + ids.filter(id => state.done[id]).length, 0);
  const ahead = doneN - plannedSoFar;

  // ısı haritası: son 26 hafta
  const weeks = 26;
  const endMon = addDays(t, -((parse(t).getDay() + 6) % 7));
  const startD = addDays(endMon, -(weeks - 1) * 7);
  let heat = '';
  for (let w = 0; w < weeks; w++) {
    heat += '<div class="hcol">';
    for (let k = 0; k < 7; k++) {
      const d = addDays(startD, w * 7 + k);
      const v = act[d] || 0;
      const lvl = d > t ? 'f' : v === 0 ? 0 : v < 1 ? 1 : v < 2 ? 2 : v < 4 ? 3 : 4;
      heat += `<i class="h${lvl}" title="${fmtLong(d)}"></i>`;
    }
    heat += '</div>';
  }

  // haftalık soru grafiği: son 8 hafta
  const wk = [];
  for (let w = 7; w >= 0; w--) {
    const ws = addDays(endMon, -w * 7);
    let q = 0, topics = 0;
    for (let k = 0; k < 7; k++) {
      const d = addDays(ws, k);
      q += state.log[d]?.q || 0;
    }
    Object.values(state.done).forEach(d => { if (d >= ws && d < addDays(ws, 7)) topics++; });
    wk.push({ label: fmt(ws), q, topics });
  }
  const maxQ = Math.max(10, ...wk.map(x => x.q));

  return `
  <div class="kpi-grid">
    <div class="card kpi">${ring(all.length ? Math.round(doneN / all.length * 100) : 0, 'tamam', 'sm')}<div><b>${doneN}/${all.length}</b><span>konu bitti</span></div></div>
    <div class="card kpi"><span class="kpi-ic">${ic('flame')}</span><div><b>${st.cur} gün</b><span>seri · en iyi ${st.best}</span></div></div>
    <div class="card kpi"><span class="kpi-ic">${ic('target')}</span><div><b>${totalQ.toLocaleString('tr-TR')}</b><span>toplam soru</span></div></div>
    <div class="card kpi"><span class="kpi-ic">${ic('reset')}</span><div><b>${Math.floor(totalMin / 60)} sa ${totalMin % 60} dk</b><span>odak süresi</span></div></div>
  </div>

  ${isAuto() ? `<section class="card pace ${ahead >= 0 ? 'good' : 'bad'}">
    <b>${plannedSoFar === 0 ? 'Plan henüz başlamadı.' : ahead >= 0 ? `Plana göre ${ahead === 0 ? 'tam zamanındasın' : `${ahead} konu öndesin`}!` : `Plana göre ${-ahead} konu geridesin.`}</b>
    <span>${plannedSoFar ? `Bugüne kadar planlanan ${plannedSoFar} konunun ${plannedDone} tanesi bitti.` : ''}${ahead < 0 ? ' "Bugün" sayfasından planı yeniden dengeleyebilirsin.' : ''}</span>
  </section>` : weekCard(endMon, t)}

  <section class="card">
    <div class="card-head"><h2>Çalışma takvimi</h2><span class="hint">son 6 ay</span></div>
    <div class="heat-wrap"><div class="heat-days"><span>Pzt</span><span></span><span>Çar</span><span></span><span>Cum</span><span></span><span>Paz</span></div><div class="heat">${heat}</div></div>
    <div class="legend heat-legend">Az <i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i> Çok</div>
  </section>

  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>Haftalık soru</h2></div>
      <div class="bars">${wk.map(x => `<div class="bcol" title="${x.q} soru · ${x.topics} konu"><span class="bval">${x.q || ''}</span><i style="height:${x.q / maxQ * 100}%"></i><span class="blab">${x.label}</span></div>`).join('')}</div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Ders ilerlemesi</h2></div>
      <div class="sub-prog">
        ${ctx.active.map(sub => {
          const ids = subjectIds(sub), dn = ids.filter(id => state.done[id]).length;
          return `<div class="sp-row" style="--c:${sub.color}"><span>${sub.exam} ${esc(sub.name)}</span><span class="sub-bar"><i style="width:${dn / ids.length * 100}%"></i></span><em>${dn}/${ids.length}</em></div>`;
        }).join('')}
      </div>
    </section>
  </div>`;
};

// Kendi programında: bu haftanın (Pzt → bugün) eklenen derslerinin kaçı tiklendi
function weekCard(mon, t) {
  let total = 0, done = 0;
  for (let d = mon; d <= t; d = addDays(d, 1)) { const dd = dayData(d); total += dd.total; done += dd.done; }
  if (!total) return `<section class="card pace"><b>Bu hafta henüz ders eklenmedi.</b><span>Takvimde bir güne dokunup ders ekleyebilirsin.</span></section>`;
  const pct = Math.round(done / total * 100);
  return `<section class="card pace ${pct >= 70 ? 'good' : 'bad'}">
    <b>Bu hafta derslerinin %${pct}'ini tamamladın${pct === 100 ? ', süper!' : '.'}</b>
    <span>Pazartesiden bugüne eklenen ${total} dersin ${done} tanesi tiklendi.</span>
  </section>`;
}

// ---- ayarlar
VIEWS.ayarlar = () => {
  const s = state.settings, u = Store.user;
  const pool = SUBJECTS.filter(sub => sub.exam === 'TYT' || ALANLAR[s.alan].ayt.includes(sub.id));
  const statusTxt = { local: 'Giriş yapılmadı', syncing: 'Senkronize ediliyor…', synced: 'Bulutla senkron', error: 'Senkron hatası' }[Store.status];
  return `
  ${adminTabs()}
  <section class="card sync-card">
    <div class="card-head"><h2>${ic('cloud')} Bulut senkronizasyonu</h2><span class="sync-pill s-${Store.status}">${statusTxt}</span></div>
    ${u ? `<div class="account">
        ${u.photoURL ? `<img src="${esc(u.photoURL)}" alt="" referrerpolicy="no-referrer">` : '<span class="avatar"></span>'}
        <div><b>${esc(u.displayName || 'Hesap')}</b><span class="hint">${esc(u.email || '')}</span></div>
        <button class="btn btn-soft btn-sm" data-act="signout">Çıkış yap</button>
      </div>
      <p class="hint">İlerlemen telefonda ve bilgisayarda aynı kalır. Değişiklikler otomatik kaydedilir.</p>`
    : `<p class="hint">Google hesabınla giriş yaparsan ilerlemen buluta kaydedilir ve tüm cihazlarında aynı olur. Giriş yapmazsan veriler sadece bu tarayıcıda durur.</p>
      <button class="btn btn-google" data-act="signin" ${Store.ready ? '' : 'disabled'}>
        <svg viewBox="0 0 48 48" class="ic"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
        Google ile giriş yap
      </button>`}
  </section>

  ${inbox.length ? `<section class="card">
    <div class="card-head"><h2>${ic('bell')} Gelen mesajlar</h2></div>
    <div class="sent-list">${inbox.slice().reverse().slice(0, 10).map(m => `<div class="sent">
      <div><b>${esc(m.title || 'Mesaj')}</b><p>${esc(m.text)}</p></div><span class="hint">${esc(m.from || 'Yönetici')} · ${ago(m.at)}</span>
    </div>`).join('')}</div>
  </section>` : ''}

  <form class="card form ${isAuto() ? '' : 'is-custom'}" data-form="settings">
    <div class="card-head"><h2>Plan ayarları</h2></div>
    <label class="field"><span>Takvim</span><select name="mode">
      <option value="custom" ${isAuto() ? '' : 'selected'}>Kendi programım (takvime derslerimi ben eklerim)</option>
      <option value="auto" ${isAuto() ? 'selected' : ''}>Otomatik plan (konular sınava kadar günlere dağıtılır)</option>
    </select></label>
    <div class="row-2">
      <label class="field"><span>Adın</span><input name="name" value="${esc(s.name)}" maxlength="30" placeholder="ör. Kaida"></label>
      <label class="field"><span>Alan</span><select name="alan">${Object.entries(ALANLAR).map(([k, a]) => `<option value="${k}" ${s.alan === k ? 'selected' : ''}>${a.name}</option>`).join('')}</select></label>
      <label class="field"><span>Sınav (TYT) tarihi</span><input type="date" name="exam" value="${s.exam}" required></label>
      <label class="field"><span>Tema</span><select name="theme">${[['auto', 'Sistem'], ['light', 'Açık'], ['dark', 'Koyu']].map(([v, l]) => `<option value="${v}" ${s.theme === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    </div>
    <div class="row-2 auto-only">
      <label class="field"><span>Plan başlangıcı</span><input type="date" name="start" value="${s.start}" required></label>
      <label class="field"><span>Günlük konu sayısı</span><select name="perDay">${[0, 1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${s.perDay === n ? 'selected' : ''}>${n ? n + ' konu' : 'Otomatik (sınava göre yay)'}</option>`).join('')}</select></label>
      <label class="field"><span>Haftalık deneme günü</span><select name="denemeDay">${[[0, 'Pazar'], [6, 'Cumartesi'], [-1, 'Yok']].map(([v, l]) => `<option value="${v}" ${s.denemeDay === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label class="field"><span>Sondaki genel tekrar dönemi</span><select name="reviewWeeks">${[0, 2, 4, 6, 8, 10].map(n => `<option value="${n}" ${s.reviewWeeks === n ? 'selected' : ''}>${n ? n + ' hafta' : 'Yok'}</option>`).join('')}</select></label>
    </div>
    <fieldset class="field">
      <span>Derslerim</span>
      <div class="subj-toggles">
        ${pool.map(sub => `<label class="toggle" style="--c:${sub.color}"><input type="checkbox" name="sub" value="${sub.id}" ${s.disabled.includes(sub.id) ? '' : 'checked'}><span>${sub.exam} ${esc(sub.name)}</span></label>`).join('')}
      </div>
    </fieldset>
    <p class="hint auto-only">Plan ayarlarını değiştirince tamamlanmamış konular bugünden itibaren yeniden dağıtılır. Bitirdiğin konular korunur.</p>
    <p class="hint custom-only">Takvim boş kalır; her güne çalışacağın dersi kendin eklersin. Konular sayfası ve bitirdiğin konular aynen durur.</p>
    <button class="btn btn-primary">Kaydet</button>
  </form>

  <section class="card">
    <div class="card-head"><h2>Veriler</h2></div>
    <div class="btn-row">
      <button class="btn btn-soft" data-act="export">${ic('down')} Yedek indir</button>
      <label class="btn btn-soft">${ic('up')} Yedek yükle<input type="file" accept="application/json" data-file="import" hidden></label>
      <button class="btn btn-danger" data-act="reset">${ic('trash')} Her şeyi sıfırla</button>
    </div>
  </section>`;
};

// ---------------------------------------------------------------- modal / toast
function openModal(html, opts = {}) {
  closeModal();
  const w = document.createElement('div');
  w.className = 'modal-wrap';
  w.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  if (opts.locked) w.dataset.locked = '1';
  w.addEventListener('click', e => { if (e.target === w && !w.dataset.locked) closeModal(); });
  document.body.append(w);
  document.body.classList.add('no-scroll');
  w.querySelector('input:not([type=hidden]):not([type=date]), select')?.focus({ preventScroll: true });
}
function closeModal() {
  document.querySelector('.modal-wrap')?.remove();
  document.body.classList.remove('no-scroll');
}

// ---------------------------------------------------------------- yönetici: kullanıcılar
let adminData = { profiles: {}, inbox: {}, error: null, loaded: false };
let adminOff = null;

function ago(ts) {
  if (!ts) return 'bilinmiyor';
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return 'az önce';
  if (s < 3600) return `${Math.floor(s / 60)} dk önce`;
  if (s < 86400) return `${Math.floor(s / 3600)} sa önce`;
  return `${Math.floor(s / 86400)} gün önce`;
}

function adminTabs() {
  if (!Store.isAdmin) return '';
  return `<nav class="seg seg-lg admin-tabs" aria-label="Ayarlar sekmeleri">
    <a href="#ayarlar" class="${ui.view === 'ayarlar' ? 'on' : ''}">${ic('gear')} Ayarlar</a>
    <a href="#kullanicilar" class="${ui.view === 'kullanicilar' ? 'on' : ''}">${ic('users')} Kullanıcılar</a>
  </nav>`;
}

const userName = (uid) => { const p = adminData.profiles[uid] || {}; return p.appName || p.name || p.email || 'İsimsiz'; };

function adminUsers() {
  return Object.entries(adminData.profiles)
    .map(([uid, p]) => ({ uid, ...p, online: !!p.connections }))
    .sort((a, b) => (b.online - a.online) || (b.lastSeen || 0) - (a.lastSeen || 0));
}

function usersHtml() {
  if (adminData.error) return `<div class="admin-err">
    <p class="hint err">Kullanıcı listesi okunamadı: veritabanı izin vermedi.</p>
    <p class="hint">Firebase → Realtime Database → Rules sekmesinde yeni kuralların (içinde <b>profiles</b> ve <b>inbox</b> geçen) yayınlandığından emin ol, sonra tekrar dene.</p>
    <p class="hint">Giriş yapılan hesap: <b>${esc(Store.user?.email || '-')}</b></p>
    <button class="btn btn-soft btn-sm" data-act="admin-retry">${ic('reset')} Tekrar dene</button>
  </div>`;
  if (!adminData.loaded) return '<p class="hint">Yükleniyor…</p>';
  const rows = adminUsers();
  if (!rows.length) return empty('Henüz kullanıcı yok', 'Google ile giriş yapıp siteyi açan herkes burada görünür.');
  return rows.map(u => {
    const msgs = Object.values(adminData.inbox[u.uid] || {}).sort((a, b) => (a.at || 0) - (b.at || 0));
    const last = msgs.at(-1);
    const me = u.uid === Store.user?.uid;
    return `<div class="urow">
      <span class="uav">${u.photo ? `<img src="${esc(u.photo)}" alt="" referrerpolicy="no-referrer">` : esc((u.name || u.email || '?')[0].toUpperCase())}<i class="udot ${u.online ? 'on' : ''}"></i></span>
      <div class="umain">
        <b>${esc(userName(u.uid))}${me ? ' <span class="you">sen</span>' : ''}</b>
        <span class="hint">${esc(u.email || '')}</span>
        <span class="ustat">${u.online ? '<em class="on">Çevrimiçi</em>' : `Son görülme: ${ago(u.lastSeen)}`}${last ? ` · Son mesaj ${last.readAt ? 'okundu ✓' : 'okunmadı'}` : ''}</span>
      </div>
      ${me ? '' : `<button class="btn btn-soft btn-sm" data-act="msg-to" data-uid="${u.uid}" aria-label="Mesaj gönder">${ic('send')}<span class="lbl">Mesaj</span></button>`}
    </div>`;
  }).join('');
}

// Aynı kimlikle birden çok kişiye giden mesajlar tek satırda toplanır.
function sentHtml() {
  const g = {};
  for (const [uid, box] of Object.entries(adminData.inbox)) {
    for (const [k, m] of Object.entries(box || {})) {
      const x = (g[k] ||= { ...m, total: 0, read: 0, to: [] });
      x.total++; if (m.readAt) x.read++; x.to.push(uid);
    }
  }
  const list = Object.values(g).sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, 10);
  if (!list.length) return '<p class="hint">Henüz mesaj göndermedin.</p>';
  return list.map(m => `<div class="sent">
    <div><b>${esc(m.title || 'Mesaj')}</b><p>${esc(m.text)}</p></div>
    <span class="hint">${ago(m.at)} · ${m.total === 1 ? esc(userName(m.to[0])) : `${m.total} kişi`} · ${m.total === 1 ? (m.read ? 'okundu ✓' : 'okunmadı') : `${m.read}/${m.total} okudu`}</span>
  </div>`).join('');
}

function userCount() {
  const all = adminUsers();
  return `${all.filter(u => u.online).length} çevrimiçi · ${all.length} kişi`;
}

VIEWS.kullanicilar = () => {
  if (!Store.isAdmin) return empty('Bu sayfa sadece yöneticiye açık', 'Yönetici hesabıyla Google girişi yapmalısın.');
  return `${adminTabs()}
  <section class="card">
    <div class="card-head"><h2>${ic('bell')} Herkese mesaj gönder</h2></div>
    <form class="form" data-form="msg-all">
      <input name="title" placeholder="Başlık (isteğe bağlı)" maxlength="60" autocomplete="off">
      <textarea name="text" placeholder="Mesajın… Gönderdiğin anda siteyi açık tutan herkesin ekranında belirir, kapalı olanlar açınca görür." maxlength="1000" rows="3" required></textarea>
      <button class="btn btn-primary">${ic('send')} Herkese gönder</button>
    </form>
  </section>
  <div class="grid-2">
    <section class="card">
      <div class="card-head"><h2>${ic('users')} Kullanıcılar</h2><span class="count" id="ucount">${userCount()}</span></div>
      <div id="users-box" class="ulist">${usersHtml()}</div>
    </section>
    <section class="card">
      <div class="card-head"><h2>Gönderilen mesajlar</h2></div>
      <div id="sent-box" class="sent-list">${sentHtml()}</div>
    </section>
  </div>`;
};

// Canlı güncellemede formlar silinmesin diye sadece listeler yenilenir.
function refreshAdmin() {
  if (ui.view !== 'kullanicilar') return;
  const u = $('#users-box'), sb = $('#sent-box'), c = $('#ucount');
  if (u) u.innerHTML = usersHtml();
  if (sb) sb.innerHTML = sentHtml();
  if (c) c.textContent = userCount();
}

function openMsgForm(uid) {
  openModal(`
    <form class="form" data-form="msg-one" data-uid="${uid}">
      <div class="modal-head"><h2>${esc(userName(uid))} kişisine mesaj</h2><button type="button" class="icon-btn" data-act="close" aria-label="Kapat">${ic('x')}</button></div>
      <input name="title" placeholder="Başlık (isteğe bağlı)" maxlength="60" autocomplete="off">
      <textarea name="text" placeholder="Mesajın…" maxlength="1000" rows="4" required></textarea>
      <button class="btn btn-primary btn-block">${ic('send')} Gönder</button>
    </form>`);
  $('[data-form="msg-one"] textarea')?.focus();
}

// ---------------------------------------------------------------- gelen mesaj popup'ı
let inbox = [];
const shown = new Set();

function showNextMessage() {
  const m = inbox.find(x => !x.readAt && !shown.has(x.id));
  let pop = $('#msg-pop');
  if (!m) { pop?.remove(); return; }
  if (pop?.dataset.id === m.id) return;
  pop?.remove();
  const at = m.at ? new Date(m.at) : new Date();
  pop = document.createElement('div');
  pop.id = 'msg-pop';
  pop.className = 'msg-wrap';
  pop.dataset.id = m.id;
  pop.innerHTML = `<div class="msg-pop" role="alertdialog" aria-modal="true" aria-labelledby="msg-title">
    <span class="msg-ic">${ic('bell')}</span>
    <p class="eyebrow">${esc(m.from || 'Yönetici')} · ${pad(at.getHours())}:${pad(at.getMinutes())}</p>
    <h2 id="msg-title">${esc(m.title || 'Yeni mesaj')}</h2>
    <p class="msg-text">${esc(m.text)}</p>
    <button class="btn btn-primary btn-block" data-act="msg-ok" data-id="${m.id}">Tamam</button>
  </div>`;
  document.body.append(pop);
  pop.querySelector('button').focus();
  chime();
  try { navigator.vibrate?.([120, 60, 120]); } catch {}
  notify(`${m.title ? m.title + ': ' : ''}${m.text}`);
}

function chime() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [[660, 0], [990, 0.12]].forEach(([f, t]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = f; o.type = 'sine'; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.15, ac.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + t + 0.35);
      o.start(ac.currentTime + t); o.stop(ac.currentTime + t + 0.35);
    });
  } catch {}
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  $('#toasts').append(el);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3000);
}

function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#6d5efc', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];
  const box = document.createElement('div');
  box.className = 'confetti';
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('i');
    p.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-delay:${Math.random() * 0.4}s;animation-duration:${1.6 + Math.random() * 1.2}s;--r:${Math.random() * 720 - 360}deg;--x:${Math.random() * 120 - 60}px`;
    box.append(p);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 3500);
}

function openOnboarding() {
  if (document.querySelector('[data-form="onboard"]')) return;
  const s = state.settings;
  openModal(`
    <form data-form="onboard" class="form onboard ${s.mode === 'auto' ? '' : 'is-custom'}">
      <div class="ob-hero">
        <span class="logo-big">${ic('cal')}</span>
        <h2>YKS Planım'a hoş geldin</h2>
        <p class="hint">Her gün çalışacağın dersleri takvime ekle, yaptıkça tikle. Konu takibini, serini ve netlerini biz tutalım.</p>
      </div>
      <label class="field"><span>Adın</span><input name="name" maxlength="30" placeholder="ör. Kaida" value="${esc(s.name)}"></label>
      <div class="field"><span>Takvimin nasıl olsun?</span>
        <div class="alan-cards mode-cards">
          <label class="alan-card"><input type="radio" name="mode" value="custom" ${s.mode === 'auto' ? '' : 'checked'}><span><b>Kendi programım</b><small>Takvim boş başlar, her güne dersimi ben eklerim.</small></span></label>
          <label class="alan-card"><input type="radio" name="mode" value="auto" ${s.mode === 'auto' ? 'checked' : ''}><span><b>Otomatik plan</b><small>Bütün konular sınava kadar günlere dağıtılsın.</small></span></label>
        </div>
      </div>
      <div class="field"><span>Alanın</span>
        <div class="alan-cards">
          ${Object.entries(ALANLAR).map(([k, a]) => `<label class="alan-card"><input type="radio" name="alan" value="${k}" ${s.alan === k ? 'checked' : ''}><span><b>${a.name}</b><small>TYT + ${a.ayt.map(id => SUB[id].name).join(', ')}</small></span></label>`).join('')}
        </div>
      </div>
      <div class="row-2">
        <label class="field auto-only"><span>Başlangıç</span><input type="date" name="start" value="${s.start}" required></label>
        <label class="field"><span>Sınav tarihi</span><input type="date" name="exam" value="${s.exam}" required></label>
      </div>
      <p class="hint">YKS 2027 tarihi ÖSYM tarafından açıklanınca Ayarlar'dan güncelleyebilirsin.</p>
      <button class="btn btn-primary btn-block">Başlayalım</button>
      ${Store.ready && !Store.user ? `<button type="button" class="btn btn-ghost btn-block" data-act="signin">Zaten planım var — Google ile giriş yap</button>` : ''}
    </form>`, { locked: true });
}

// ---------------------------------------------------------------- etkileşim
function toggleTopic(id) {
  const before = dayData(today());
  if (state.done[id]) delete state.done[id];
  else state.done[id] = today();
  afterToggle(before);
}

function afterToggle(before) {
  buildCtx();
  const after = dayData(today());
  commit();
  if (after.total && after.done === after.total && before.done < before.total) {
    confetti();
    toast('Bugünün planı tamamlandı! Harikasın.');
  }
}

function moveTopic(id, from, to) {
  state.plan[from] = (state.plan[from] || []).filter(x => x !== id);
  if (!state.plan[from].length) delete state.plan[from];
  (state.plan[to] ||= []).push(id);
}

function rebalanceFrom() {
  const s = state.settings, t = today();
  return s.start > t ? s.start : t;
}

function authError(e) {
  const msg = {
    'auth/configuration-not-found': 'Firebase Authentication henüz açılmamış (Console → Authentication → Başlayın).',
    'auth/operation-not-allowed': 'Google ile giriş kapalı (Console → Authentication → Sign-in method → Google).',
    'auth/unauthorized-domain': `${location.hostname} yetkili alan adı değil (Authentication → Settings → Authorized domains).`,
    'auth/network-request-failed': 'İnternet bağlantısı yok gibi görünüyor.',
    'auth/popup-blocked': 'Tarayıcı giriş penceresini engelledi, açılır pencerelere izin ver.',
  }[e.code];
  return msg || 'Giriş yapılamadı: ' + (e.code || e.message);
}

const ACTIONS = {
  topic: el => toggleTopic(el.dataset.id),
  review: el => {
    const before = dayData(today()), k = el.dataset.key;
    if (state.reviews[k]) delete state.reviews[k]; else state.reviews[k] = today();
    afterToggle(before);
  },
  special: el => {
    const before = dayData(today()), d = el.dataset.date;
    if (state.special[d]) delete state.special[d]; else state.special[d] = today();
    afterToggle(before);
  },
  custom: el => {
    const before = dayData(today());
    const c = (state.custom[el.dataset.date] || []).find(x => x.id === el.dataset.id);
    if (c) c.done = !c.done;
    afterToggle(before);
  },
  'del-custom': el => {
    const d = el.dataset.date;
    state.custom[d] = (state.custom[d] || []).filter(x => x.id !== el.dataset.id);
    if (!state.custom[d].length) delete state.custom[d];
    commit();
  },
  wtoggle: el => {
    const before = dayData(today()), k = el.dataset.key;
    if (state.wdone[k]) delete state.wdone[k]; else state.wdone[k] = today();
    afterToggle(before);
  },
  // Her hafta tekrar eden ders: sadece o günden mi, bundan sonraki tüm haftalardan mı?
  wdel: el => {
    const { id, date } = el.dataset;
    const w = Object.values(state.weekly).flat().find(x => x.id === id);
    if (!w) return;
    const l = subLabel(w.sub, w.text), gun = GUNLER[parse(date).getDay()].toLocaleLowerCase('tr');
    openModal(`
      <div class="form">
        <div class="modal-head"><h2>Dersi kaldır</h2><button type="button" class="icon-btn" data-act="close" aria-label="Kapat">${ic('x')}</button></div>
        <p><b>${esc(l.title)}</b> her ${gun} tekrar ediyor.</p>
        <button class="btn btn-soft btn-block" data-act="wdel-one" data-id="${id}" data-date="${date}">Sadece ${fmt(date)} gününden kaldır</button>
        <button class="btn btn-danger btn-block" data-act="wdel-all" data-id="${id}" data-date="${date}">${fmt(date)} ve sonraki tüm haftalardan kaldır</button>
      </div>`);
  },
  'wdel-one': el => {
    state.wskip[`${el.dataset.date}_${el.dataset.id}`] = true;
    closeModal();
    commit();
  },
  'wdel-all': el => {
    const { id, date } = el.dataset;
    for (const [dow, list] of Object.entries(state.weekly)) {
      // Geçmiş haftalar (tiklenenler dahil) korunur; ders bu günden itibaren görünmez.
      state.weekly[dow] = list.flatMap(w => w.id !== id ? [w] : w.from >= date ? [] : [{ ...w, until: date }]);
      if (!state.weekly[dow].length) delete state.weekly[dow];
    }
    closeModal();
    commit();
    toast('Ders programdan kaldırıldı');
  },
  postpone: el => {
    let to = addDays(el.dataset.date, 1);
    if (parse(to).getDay() === state.settings.denemeDay) to = addDays(to, 1);
    moveTopic(el.dataset.id, el.dataset.date, to);
    commit();
    toast(`${fmtLong(to)} gününe ertelendi`);
  },
  pull: el => { moveTopic(el.dataset.id, el.dataset.date, today()); commit(); },
  rebalance: () => {
    if (!confirm('Tamamlanmamış tüm konular bugünden sınava kadar yeniden dağıtılsın mı?')) return;
    buildPlan(rebalanceFrom());
    commit();
    toast('Plan yeniden dengelendi');
  },
  q: el => {
    const t = today(), l = (state.log[t] ||= {});
    l.q = Math.max(0, (l.q || 0) + Number(el.dataset.n));
    commit();
  },
  'pomo-toggle': () => {
    if (pomo.running) { pomo.left = Math.max(0, Math.round((pomo.endAt - Date.now()) / 1000)); pomoStop(); }
    else {
      pomo.running = true;
      pomo.endAt = Date.now() + pomo.left * 1000;
      pomo.timer = setInterval(pomoTick, 250);
      try { if (Notification.permission === 'default') Notification.requestPermission(); } catch {}
    }
    paintPomo();
  },
  'pomo-reset': () => { pomoStop(); pomo.left = pomoLen(); paintPomo(); },
  'pomo-skip': () => pomoComplete(true),
  'pomo-len': el => {
    state.settings.pomo = Number(el.dataset.n);
    if (!pomo.running) { pomo.mode = 'focus'; pomo.left = pomoLen(); }
    commit();
  },
  'sel-day': el => {
    ui.sel = el.dataset.date;
    if (ui.sel.slice(0, 7) !== ui.month) ui.month = ui.sel.slice(0, 7);
    render();
    if (innerWidth < 900) $('#day-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  month: el => {
    const [y, m] = ui.month.split('-').map(Number);
    ui.month = ymd(new Date(y, m - 1 + Number(el.dataset.n), 1)).slice(0, 7);
    render();
  },
  'cal-today': () => { ui.sel = today(); ui.month = ui.sel.slice(0, 7); render(); },
  goto: el => { ui.sel = el.dataset.date; ui.month = ui.sel.slice(0, 7); location.hash = 'takvim'; },
  'konu-tab': el => { ui.konuTab = el.dataset.tab; render(); },
  'deneme-tab': el => { ui.denemeTab = el.dataset.tab; render(); },
  'deneme-new': () => openDenemeForm(),
  'deneme-del': el => {
    if (!confirm('Bu deneme silinsin mi?')) return;
    state.denemeler = state.denemeler.filter(x => x.id !== el.dataset.id);
    commit();
  },
  close: () => closeModal(),
  'msg-to': el => openMsgForm(el.dataset.uid),
  // İzin hatası alan dinleyiciler kendiliğinden yeniden denemez; aboneliği baştan kur.
  'admin-retry': () => {
    adminOff?.();
    adminData = { profiles: {}, inbox: {}, error: null, loaded: false };
    refreshAdmin();
    adminOff = Store.watchAdmin(data => { adminData = data; refreshAdmin(); });
  },
  'msg-ok': el => {
    shown.add(el.dataset.id);
    Store.markRead(el.dataset.id);
    showNextMessage();
  },
  theme: () => {
    const order = ['auto', 'light', 'dark'];
    state.settings.theme = order[(order.indexOf(state.settings.theme) + 1) % 3];
    applyTheme();
    commit({ render: false });
    toast({ auto: 'Tema: sistem', light: 'Tema: açık', dark: 'Tema: koyu' }[state.settings.theme]);
  },
  signin: async () => {
    try { await Store.signIn(); } catch (e) { toast(authError(e)); console.error(e); }
  },
  signout: async () => { await Store.signOut(); toast('Çıkış yapıldı. Veriler bu cihazda kalmaya devam eder.'); },
  export: () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `yks-planim-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  },
  reset: () => {
    if (!confirm('Bütün ilerleme, denemeler ve notlar silinecek. Emin misin?')) return;
    const keep = state.syncUid;
    state = defaultState();
    state.syncUid = keep;
    commit();
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  e.preventDefault();
  ACTIONS[el.dataset.act]?.(el, e);
});

document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]');
  if (!f) return;
  e.preventDefault();
  const fd = new FormData(f);
  FORMS[f.dataset.form]?.(fd, f);
});

async function sendMsg(uids, fd, f, done) {
  const text = String(fd.get('text') || '').trim(), title = String(fd.get('title') || '').trim();
  if (!text) return;
  if (!uids.length) { toast('Henüz mesaj gönderilecek başka kullanıcı yok'); return; }
  const btn = f.querySelector('button.btn-primary');
  btn.disabled = true;
  try {
    await Store.sendMessage(uids, { title, text });
    f.reset();
    done?.();
    toast(uids.length === 1 ? 'Mesaj gönderildi' : `${uids.length} kişiye gönderildi`);
  } catch (e) {
    toast('Gönderilemedi: ' + (e.code || e.message));
  } finally { btn.disabled = false; }
}

const FORMS = {
  'msg-all': (fd, f) => sendMsg(adminUsers().filter(u => u.uid !== Store.user?.uid).map(u => u.uid), fd, f),
  'msg-one': (fd, f) => sendMsg([f.dataset.uid], fd, f, closeModal),
  custom: (fd, f) => {
    const d = f.dataset.date;
    const text = String(fd.get('text') || '').trim(), sub = SUB[fd.get('sub')] ? fd.get('sub') : '';
    if (!text && !sub) { toast('Bir ders seç ya da not yaz'); return; }
    if (fd.get('weekly')) {
      const dow = parse(d).getDay();
      (state.weekly[dow] ||= []).push({ id: uid(), sub, text, from: d });
      toast(`Her ${GUNLER[dow].toLocaleLowerCase('tr')} takvimine eklendi`);
    } else {
      (state.custom[d] ||= []).push({ id: uid(), sub, text, done: false });
    }
    commit();
  },
  deneme: fd => {
    const type = ui.denemeTab, s = {};
    DENEME[type].forEach(([k, , n]) => {
      const d = Math.min(n, Math.max(0, Number(fd.get(k + '_d')) || 0));
      const y = Math.min(n - d, Math.max(0, Number(fd.get(k + '_y')) || 0));
      s[k] = { d, y };
    });
    state.denemeler.push({ id: uid(), type, date: fd.get('date') || today(), name: String(fd.get('name') || '').trim(), s });
    closeModal();
    commit();
    toast(`Kaydedildi: ${r2(netOf(type, s))} net`);
  },
  onboard: fd => {
    const s = state.settings;
    s.name = String(fd.get('name') || '').trim();
    s.alan = fd.get('alan') || 'say';
    s.start = fd.get('start') || today();
    s.exam = fd.get('exam') || s.exam;
    s.mode = fd.get('mode') === 'auto' ? 'auto' : 'custom';
    if (s.mode === 'custom') s.start = today();
    if (s.exam <= s.start) { toast('Sınav tarihi bugünden sonra olmalı'); return; }
    state.onboarded = true;
    if (s.mode === 'auto') buildPlan(s.start);
    closeModal();
    commit();
    toast(s.mode === 'auto' ? 'Planın hazır! İlk konuların "Bugün" sayfasında.' : 'Hazırsın! Bugünün dersini aşağıdan ekleyebilirsin.');
  },
  settings: fd => {
    const s = state.settings;
    const pool = SUBJECTS.filter(sub => sub.exam === 'TYT' || ALANLAR[fd.get('alan')].ayt.includes(sub.id)).map(x => x.id);
    const on = fd.getAll('sub');
    const next = {
      ...s,
      mode: fd.get('mode') === 'auto' ? 'auto' : 'custom',
      name: String(fd.get('name') || '').trim(),
      alan: fd.get('alan'),
      start: fd.get('start'),
      exam: fd.get('exam'),
      perDay: Number(fd.get('perDay')),
      denemeDay: Number(fd.get('denemeDay')),
      reviewWeeks: Number(fd.get('reviewWeeks')),
      theme: fd.get('theme'),
      // alan değişince yeni alanın dersleri varsayılan olarak açık gelsin
      disabled: fd.get('alan') === s.alan ? pool.filter(id => !on.includes(id)) : s.disabled.filter(id => id.startsWith('tyt-') && !on.includes(id)),
    };
    if (next.exam <= next.start) { toast('Sınav tarihi başlangıçtan sonra olmalı'); return; }
    // Otomatik plan yalnızca otomatik modda (ve plana dair bir şey değiştiyse) yeniden kurulur.
    const keys = ['mode', 'alan', 'start', 'exam', 'perDay', 'denemeDay', 'reviewWeeks'];
    const replan = next.mode === 'auto' && (keys.some(k => next[k] !== s[k]) || next.disabled.join() !== s.disabled.join());
    state.settings = next;
    applyTheme();
    if (replan) buildPlan(rebalanceFrom());
    commit();
    toast(replan ? 'Kaydedildi, plan güncellendi' : 'Kaydedildi');
  },
};

let noteTimer;
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.note) {
    const d = el.dataset.note, v = el.value;
    if (v.trim()) state.notes[d] = v; else delete state.notes[d];
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => commit({ render: false }), 500);
  } else if (el.dataset.input === 'konuQ') {
    ui.konuQ = el.value;
    $('#konu-list').innerHTML = konuList(ctx.active.filter(sub => sub.exam === ui.konuTab));
  } else if (el.closest('[data-form="deneme"]')) {
    const f = el.closest('form');
    let tot = 0;
    f.querySelectorAll('.dt-r').forEach(r => {
      const [d, y] = r.querySelectorAll('input');
      const n = (Number(d.value) || 0) - (Number(y.value) || 0) / 4;
      r.querySelector('output').textContent = r2(n);
      tot += n;
    });
    $('#dt-total').textContent = r2(tot);
  }
});

document.addEventListener('change', e => {
  if (e.target.name === 'mode') {
    e.target.closest('form')?.classList.toggle('is-custom', e.target.value !== 'auto');
  } else if (e.target.dataset.file === 'import') {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then(txt => {
      const data = JSON.parse(txt);
      if (!data.settings || !data.plan) throw new Error();
      if (!confirm('Yedek yüklenecek ve mevcut veriler değiştirilecek. Devam edilsin mi?')) return;
      const keep = state.syncUid;
      state = migrate(data);
      state.syncUid = keep;
      applyTheme();
      commit();
      toast('Yedek yüklendi');
    }).catch(() => toast('Geçersiz yedek dosyası'));
  }
});

document.addEventListener('toggle', e => {
  const d = e.target;
  if (d.matches?.('details.subject') && !ui.konuQ) ui.open[d.dataset.sub] = d.open;
}, true);

document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('.modal-wrap')?.dataset.locked) closeModal(); });

// ---------------------------------------------------------------- render
const NAV = ['bugun', 'takvim', 'konular', 'deneme', 'istatistik', 'ayarlar', 'kullanicilar'];

function applyTheme() {
  const t = state.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.dataset.theme = t;
  const btn = $('#theme-btn');
  if (btn) btn.innerHTML = ic({ auto: 'auto', light: 'sun', dark: 'moon' }[t]);
}

function renderTop() {
  const left = Math.max(0, diffDays(today(), state.settings.exam));
  $('#countdown').innerHTML = `<b>${left}</b> gün`;
  const st = Store.status;
  const sb = $('#sync-btn');
  sb.className = `icon-btn sync s-${st}`;
  sb.title = { local: 'Buluta bağlı değil', syncing: 'Kaydediliyor…', synced: 'Bulutla senkron', error: 'Senkron hatası' }[st];
}

function render() {
  if (!NAV.includes(ui.view)) ui.view = 'bugun';
  buildCtx();
  document.body.classList.toggle('is-admin', Store.isAdmin);
  document.querySelectorAll('[data-nav]').forEach(a => {
    const on = a.dataset.nav === ui.view;
    a.classList.toggle('active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  const view = $('#view');
  const focused = document.activeElement?.dataset?.input;
  view.innerHTML = VIEWS[ui.view]();
  view.dataset.view = ui.view;
  if (focused) { const el = view.querySelector(`[data-input="${focused}"]`); el?.focus(); el?.setSelectionRange?.(el.value.length, el.value.length); }
  const heat = view.querySelector('.heat-wrap');
  if (heat) heat.scrollLeft = heat.scrollWidth;
  renderTop();
  paintPomo();
  if (!state.onboarded) openOnboarding();
}

function route() {
  const v = location.hash.slice(1) || 'bugun';
  const changed = v !== ui.view;
  ui.view = NAV.includes(v) ? v : 'bugun';
  render();
  if (changed) scrollTo({ top: 0 });
}

addEventListener('hashchange', route);

// gece yarısı geçince "bugün" yenilensin
let lastDay = today();
setInterval(() => { if (today() !== lastDay) { lastDay = today(); render(); } }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && today() !== lastDay) { lastDay = today(); render(); } });

Store.on('status', () => { renderTop(); if (ui.view === 'ayarlar') render(); });
Store.on('auth', () => {
  if (Store.isAdmin && !adminOff) adminOff = Store.watchAdmin(data => { adminData = data; refreshAdmin(); });
  else if (!Store.isAdmin && adminOff) { adminOff(); adminOff = null; adminData = { profiles: {}, inbox: {}, error: null, loaded: false }; }
  if (ui.view === 'ayarlar' || ui.view === 'kullanicilar' || !state.onboarded) { closeModal(); render(); }
  else document.body.classList.toggle('is-admin', Store.isAdmin);
});
Store.on('inbox', msgs => {
  inbox = msgs;
  showNextMessage();
  if (ui.view === 'ayarlar' && !document.activeElement?.closest('form')) render();
});
Store.on('remote', data => {
  state = migrate(data);
  applyTheme();
  closeModal();
  render();
  toast('Bulut verilerin yüklendi');
});

applyTheme();
route();
Store.init(() => state);
