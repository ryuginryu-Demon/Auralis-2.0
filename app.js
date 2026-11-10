const tracks = [
 {id:1,title:"Acoustic Breeze",artist:"Benjamin Tissot",album:"Soft Focus",duration:"2:37",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",art:"a1",symbol:"☀"},
 {id:2,title:"Creative Minds",artist:"Auralis Sessions",album:"Open Skies",duration:"3:12",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",art:"a2",symbol:"✦"},
 {id:3,title:"Once Again",artist:"Evening Collective",album:"After Hours",duration:"4:08",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",art:"a3",symbol:"☾"},
 {id:4,title:"Sunny",artist:"Morning Tapes",album:"Golden Hour",duration:"3:46",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",art:"a4",symbol:"✺"},
 {id:5,title:"Energy",artist:"Motion Lab",album:"Momentum",duration:"4:21",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",art:"a5",symbol:"⚡"},
 {id:6,title:"Deep Blue",artist:"Low Tide",album:"Blue Notes",duration:"3:58",url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",art:"a6",symbol:"◉"}
];
const audio=document.getElementById('audio'), main=document.getElementById('main');
let current=null, page='home', query='', queue=[...tracks], queueIndex=0, shuffle=false, repeat=false;
let liked=new Set(JSON.parse(localStorage.getItem('auralis-liked')||'[]'));
let playlist=JSON.parse(localStorage.getItem('auralis-playlist')||'[]');
const art=t=>`<div class="art ${t.art}"><b>${t.symbol||'♫'}</b></div>`;
const fmt=s=>{if(!Number.isFinite(s))return '0:00';return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')};
function trackRow(t){return `<div class="track ${current?.id===t.id?'playing':''}"><button class="play-small" data-play="${t.id}">${current?.id===t.id&&!audio.paused?'Ⅱ':'▶'}</button><div style="display:flex;align-items:center;gap:11px;min-width:0">${art(t).replace('class="art','class="miniart art')}<div style="min-width:0"><div class="track-title">${t.title}</div><div class="track-artist">${t.artist} · ${t.album}</div></div></div><span class="duration">${t.duration}</span><button class="heart ${liked.has(t.id)?'liked':''}" data-like="${t.id}">${liked.has(t.id)?'♥':'♡'}</button></div>`}
function cards(list){return `<div class="cards">${list.map(t=>`<article class="card" data-play="${t.id}">${art(t)}<h3>${t.title}</h3><p>${t.artist}</p></article>`).join('')}</div>`}
function bind(){document.querySelectorAll('[data-play]').forEach(el=>el.addEventListener('click',()=>playId(+el.dataset.play)));document.querySelectorAll('[data-like]').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();toggleLike(+el.dataset.like)}));document.querySelectorAll('[data-page]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.page)))}
function go(p){page=p;document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===p));render()}
function render(){
 let html='';
 if(page==='home') html=`<section class="hero"><div class="hero-copy"><div class="eyebrow">YOUR SOUND. YOUR SPACE.</div><h1>Find your<br>frequency.</h1><p>A fresh soundtrack for wherever the day takes you.</p><button class="primary" id="mixBtn">▶ &nbsp; Play your mix</button></div></section>
 <div class="section-head"><h2>Made for you</h2><span class="subtle">Demo collection</span></div>${cards(tracks.slice(0,4))}
 <div class="section-head"><h2>Quick picks</h2><span class="subtle">Jump back in</span></div><div class="quick-grid">${tracks.slice(0,6).map(t=>`<div class="quick" data-play="${t.id}">${art(t)}<span>${t.title}</span><button>▶</button></div>`).join('')}</div>`;
 if(page==='search') html=`<div class="section-head"><h2>Search</h2><span class="subtle">Find your next favourite</span></div><div class="searchbar">⌕ <input id="searchInput" placeholder="What do you want to listen to?" value="${query.replaceAll('"','&quot;')}"></div><div class="section-head"><h2>${query?'Results':'Browse all'}</h2><span class="subtle">${tracks.length} demo tracks</span></div><div class="track-list">${tracks.filter(t=>(t.title+' '+t.artist+' '+t.album).toLowerCase().includes(query.toLowerCase())).map(trackRow).join('')||'<div class="empty">No tracks found. Try another search.</div>'}</div>`;
 if(page==='library') html=`<div class="section-head"><h2>Your Library</h2><span class="subtle">Saved on this device</span></div><div class="quick-grid"><div class="quick" data-page="liked"><div class="art a4">♥</div><span>Liked Songs</span></div><div class="quick" data-page="playlist"><div class="art a3">♫</div><span>My Playlist</span></div></div><div class="section-head"><h2>Recently played</h2></div><div class="track-list">${tracks.slice(0,3).map(trackRow).join('')}</div>`;
 if(page==='liked'){let arr=tracks.filter(t=>liked.has(t.id));html=`<div class="hero" style="min-height:170px;background:linear-gradient(120deg,#5a397a,#23224b)"><div class="hero-copy"><div class="eyebrow">YOUR COLLECTION</div><h1>Liked Songs</h1><p>${arr.length} saved tracks</p></div></div><div class="track-list">${arr.map(trackRow).join('')||'<div class="empty"><strong>Your liked songs live here.</strong>Tap ♡ on any track to save it.</div>'}</div>`}
 if(page==='playlist'){let arr=tracks.filter(t=>playlist.includes(t.id));html=`<div class="section-head"><h2>My Playlist</h2><button class="pill" id="addAll">＋ Add demo tracks</button></div><p class="subtle">A playlist stored on this device.</p><div class="track-list">${arr.map(trackRow).join('')||'<div class="empty"><strong>Your playlist is ready.</strong>Use the button above to add the demo collection.</div>'}</div>`}
 main.innerHTML=html;bind();
 const si=document.getElementById('searchInput');if(si)si.addEventListener('input',e=>{query=e.target.value;const pos=e.target.selectionStart;render();const n=document.getElementById('searchInput');n.focus();n.setSelectionRange(pos,pos)});
 const mix=document.getElementById('mixBtn');if(mix)mix.onclick=()=>playId(tracks[0].id);
 const add=document.getElementById('addAll');if(add)add.onclick=()=>{playlist=[...new Set([...playlist,...tracks.map(t=>t.id)])];localStorage.setItem('auralis-playlist',JSON.stringify(playlist));render();toast('Demo tracks added to your playlist')};
}
function playId(id){let idx=queue.findIndex(t=>t.id===id);if(idx<0){queue=[...tracks];idx=queue.findIndex(t=>t.id===id)}queueIndex=idx;loadTrack(queue[queueIndex],true)}
function loadTrack(t,autoplay){current=t;audio.src=t.url;document.getElementById('playerTitle').textContent=t.title;document.getElementById('playerArtist').textContent=t.artist;let pa=document.getElementById('playerArt');pa.className='art '+t.art;pa.innerHTML='<b>'+t.symbol+'</b>';updateLikeButton();render();if(autoplay)audio.play().then(updatePlayButton).catch(()=>toast('Could not stream this track. Check your connection.'));updatePlayButton()}
function togglePlay(){if(!current){playId(tracks[0].id);return}if(audio.paused)audio.play().then(updatePlayButton).catch(()=>toast('Playback unavailable. Check your connection.'));else{audio.pause();updatePlayButton()}}
function updatePlayButton(){document.getElementById('playBtn').textContent=audio.paused?'▶':'Ⅱ';document.getElementById('playBtn').title=audio.paused?'Play':'Pause'}
function next(){if(!queue.length)return;queueIndex=shuffle?Math.floor(Math.random()*queue.length):(queueIndex+1)%queue.length;loadTrack(queue[queueIndex],true)}
function prev(){if(audio.currentTime>3){audio.currentTime=0;return}queueIndex=(queueIndex-1+queue.length)%queue.length;loadTrack(queue[queueIndex],true)}
function toggleLike(id){liked.has(id)?liked.delete(id):liked.add(id);localStorage.setItem('auralis-liked',JSON.stringify([...liked]));updateLikeButton();render()}
function updateLikeButton(){let b=document.getElementById('playerLike');b.textContent=current&&liked.has(current.id)?'♥':'♡';b.classList.toggle('liked',!!current&&liked.has(current.id))}
function toast(msg){let t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.append(t);setTimeout(()=>t.remove(),2300)}
document.getElementById('playBtn').onclick=togglePlay;document.getElementById('nextBtn').onclick=next;document.getElementById('prevBtn').onclick=prev;
document.getElementById('playerLike').onclick=()=>current&&toggleLike(current.id);
document.getElementById('shuffleBtn').onclick=e=>{shuffle=!shuffle;e.currentTarget.style.color=shuffle?'var(--lime)':'var(--muted)';toast(shuffle?'Shuffle on':'Shuffle off')};
document.getElementById('repeatBtn').onclick=e=>{repeat=!repeat;e.currentTarget.style.color=repeat?'var(--lime)':'var(--muted)';toast(repeat?'Repeat current track on':'Repeat off')};
document.getElementById('queueBtn').onclick=()=>{go('library');toast('Queue follows the demo collection order')};
document.getElementById('volume').oninput=e=>audio.volume=+e.target.value;audio.volume=.8;
audio.ontimeupdate=()=>{let s=document.getElementById('seek');s.max=audio.duration||100;s.value=audio.currentTime||0;document.getElementById('elapsed').textContent=fmt(audio.currentTime);document.getElementById('total').textContent=fmt(audio.duration)};
document.getElementById('seek').oninput=e=>{if(Number.isFinite(audio.duration))audio.currentTime=+e.target.value};
audio.onended=()=>{if(repeat){audio.currentTime=0;audio.play()}else next()};
audio.onerror=()=>toast('This demo stream is unavailable right now.');
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;let b=document.getElementById('installBtn');b.hidden=false;b.onclick=async()=>{deferredPrompt.prompt();deferredPrompt=null;b.hidden=true}});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
