// Datenmodell
let eintraege = JSON.parse(localStorage.getItem('eintraege')) || [];

// Speichern im localStorage
function saveToLocalStorage() {
    localStorage.setItem('eintraege', JSON.stringify(eintraege));
}
// Header/Footer laden (für alle Seiten wiederverwendbar)
document.getElementById('header').innerHTML = `
    <h1>Mein Gefühls-Tagebuch</h1>
    <p class="subtitle">Reflektiere deine Emotionen, jeden Tag.</p>
`;

document.getElementById('footer').innerHTML = `
    <p>© ${new Date().getFullYear()} – Made with ❤️</p>
`;

// Einträge rendern
function renderEintraege() {
    const container = document.getElementById('eintraege-container');
    container.innerHTML = eintraege.map((eintrag, index) => `
        <article class="eintrag" data-id="${index}">
            <div class="eintrag-header">
                <span class="datum">${new Date(eintrag.datum).toLocaleDateString('de-DE')}</span>
                <span class="stimmung ${eintrag.stimmung}">${getEmoji(eintrag.stimmung)} ${eintrag.stimmung}</span>
            </div>
            <p class="notiz">${eintrag.notiz}</p>
            <div class="eintrag-actions">
                <button onclick="editEintrag(${index})">Bearbeiten</button>
                <button onclick="deleteEintrag(${index})">Löschen</button>
            </div>
        </article>
    `).join('');
}

// Emoji-Helper
function getEmoji(stimmung) {
    const emojis = { glücklich: '😊', neutral: '😐', traurig: '😢' };
    return emojis[stimmung] || '';
}
// Neuer Eintrag
document.getElementById('eintrag-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newEintrag = {
        datum: document.getElementById('datum').value,
        stimmung: document.getElementById('stimmung').value,
        notiz: document.getElementById('notiz').value
    };
    eintraege.push(newEintrag);
    saveToLocalStorage();
    renderEintraege();
    e.target.reset(); // Formular leeren
});

// Eintrag löschen
function deleteEintrag(index) {
    eintraege.splice(index, 1);
    saveToLocalStorage();
    renderEintraege();
}

// Eintrag bearbeiten (vereinfacht)
function editEintrag(index) {
    const eintrag = eintraege[index];
    document.getElementById('datum').value = eintrag.datum;
    document.getElementById('stimmung').value = eintrag.stimmung;
    document.getElementById('notiz').value = eintrag.notiz;
    deleteEintrag(index); // Alten Eintrag entfernen
}
