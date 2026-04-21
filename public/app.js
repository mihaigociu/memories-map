const map = L.map('map').setView([50, 15], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const panel = document.getElementById('panel');
const panelContent = document.getElementById('panel-content');
const panelClose = document.getElementById('panel-close');

panelClose.addEventListener('click', () => {
  panel.classList.add('hidden');
});

fetch('/api/places')
  .then(res => res.json())
  .then(data => {
    data.places.forEach(place => {
      const marker = L.marker([place.lat, place.lng]).addTo(map);
      marker.bindTooltip(place.name, { permanent: false, direction: 'top' });
      marker.on('click', () => openPanel(place));
    });
  });

function openPanel(place) {
  panelContent.innerHTML = `<h2>${place.name}</h2>` + place.memories.map(renderMemory).join('');
  panel.classList.remove('hidden');
}

function renderMemory(memory) {
  const header = `<div class="student-name">${memory.student}</div>`;

  if (memory.type === 'text') {
    return `<div class="memory-card">${header}<p>${memory.content}</p></div>`;
  }

  if (memory.type === 'photo') {
    const src = memory.url || `/uploads/${memory.file}`;
    return `
      <div class="memory-card">
        ${header}
        <img src="${src}" alt="${memory.caption || ''}" loading="lazy" />
        ${memory.caption ? `<div class="caption">${memory.caption}</div>` : ''}
      </div>`;
  }

  if (memory.type === 'video') {
    const src = memory.url || `/uploads/${memory.file}`;
    return `
      <div class="memory-card">
        ${header}
        <video controls>
          <source src="${src}" />
          Your browser does not support video.
        </video>
        ${memory.caption ? `<div class="caption">${memory.caption}</div>` : ''}
      </div>`;
  }

  if (memory.type === 'youtube') {
    return `
      <div class="memory-card">
        ${header}
        <div class="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/${memory.videoId}"
            title="${memory.caption || 'Video'}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        ${memory.caption ? `<div class="caption">${memory.caption}</div>` : ''}
      </div>`;
  }

  return '';
}
