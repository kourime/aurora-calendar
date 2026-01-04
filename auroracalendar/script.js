let currentDate = new Date();
const holidays = {
    "1-1":"Новый год", "1-2":"Новый год", "1-7":"Рождество",
    "3-8":"Женский день", "3-21":"Наурыз", "3-22":"Наурыз", "3-23":"Наурыз",
    "5-1":"День единства", "5-7":"День защитника", "5-9":"День Победы",
    "7-6":"День Столицы", "8-30":"День Конституции", "10-25":"День Республики",
    "12-16":"День Независимости"
};

async function initApp() {
    setInterval(() => {
        const el = document.getElementById('local-time');
        if (el) el.innerText = new Date().toLocaleTimeString('ru-RU');
    }, 1000);

    getMeteo(51.23, 51.36); // Уральск по дефолту
    render();
}

async function getMeteo(lat, lon) {
    try {
        const wUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=sunrise,sunset&timezone=auto`;
        const gUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        const [wR, gR] = await Promise.all([fetch(wUrl), fetch(gUrl)]);
        const wD = await wR.json(), gD = await gR.json();
        
        document.getElementById('city-name').innerText = gD.address.city || gD.address.town || "Уральск";
        document.getElementById('weather-temp').innerText = `${Math.round(wD.current.temperature_2m)}°C`;
        document.getElementById('sun-info').innerText = `Восход: ${wD.daily.sunrise[0].split('T')[1]} | Закат: ${wD.daily.sunset[0].split('T')[1]}`;
    } catch (e) { console.error(e); }
}

function render() {
    const grid = document.getElementById('calendar-grid');
    const m = currentDate.getMonth(), y = currentDate.getFullYear();
    const curSeason = ['winter', 'spring', 'summer', 'autumn'][[0,0,1,1,1,2,2,2,3,3,3,0][m]];
    
    const bgs = {
        winter: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200",
        spring: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200",
        summer: "https://images.unsplash.com/photo-1470252649358-96957c053e9a?w=1200",
        autumn: "https://images.unsplash.com/photo-1444492412393-e3a0919959ee?w=1200"
    };

    document.getElementById('bg-container').style.backgroundImage = `url('${bgs[curSeason]}')`;
    document.getElementById('month-label').innerText = new Intl.DateTimeFormat('ru', {month:'long', year:'numeric'}).format(currentDate);
    
    grid.innerHTML = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'].map(d => `<div class="day-name">${d}</div>`).join('');
    
    let firstDay = new Date(y, m, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="day empty"></div>`;
    for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
        const h = holidays[`${m+1}-${d}`];
        const isToday = new Date().toDateString() === new Date(y, m, d).toDateString();
        const cls = ['day'];
        if ((firstDay+d-1)%7 >= 5) cls.push('weekend');
        if (h) cls.push('holiday');
        if (isToday) cls.push('today');
        grid.innerHTML += `<div class="${cls.join(' ')}" onclick="showInfo(${d},'${h||'Праздников нет'}')">${d}</div>`;
    }
    setTimeout(() => initFX(curSeason), 200);
}

function showInfo(d, t) {
    document.getElementById('detail-box').style.display = 'block';
    document.getElementById('detail-date').innerText = d + ' ' + new Intl.DateTimeFormat('ru', {month:'long'}).format(currentDate);
    document.getElementById('detail-text').innerText = t;
}

function changeMonth(v) { currentDate.setMonth(currentDate.getMonth()+v); render(); }

const canvas = document.getElementById('fx-canvas'), ctx = canvas.getContext('2d');
let particles = [];

function initFX(s) {
    canvas.width = 1000; canvas.height = 1000;
    particles = [];
    const color = s==='winter' ? '#fff' : (s==='autumn' ? '#ffa502' : '#2ed573');
    for(let i=0; i<100; i++) {
        particles.push({x: Math.random()*1000, y: Math.random()*1000, r: Math.random()*3+1, v: Math.random()*1.5+0.5, c: color});
    }
}

function draw() {
    ctx.clearRect(0,0,1000,1000);
    particles.forEach(p => {
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        p.y += p.v; if(p.y > 1000) p.y = -10;
    });
    requestAnimationFrame(draw);
}

window.onload = () => { initApp(); draw(); };