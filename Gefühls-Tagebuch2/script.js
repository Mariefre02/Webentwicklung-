// Datenmodell
// 1. Lädt gespeicherte Einträge aus dem LocalStorage oder initialisiert ein leeres Array
let eintraege = JSON.parse(localStorage.getItem('eintraege')) || [];

// Speichern im localStorage
function saveToLocalStorage() {
    localStorage.setItem('eintraege', JSON.stringify(eintraege));
}
// Setzt Header/Footer-HTML (für alle Seiten wiederverwendbar)
document.getElementById('header').innerHTML = `
    <h1>Mein Gefühls-Tagebuch</h1>
    <p class="subtitle">Reflektiere deine Emotionen, jeden Tag.</p>
`;

document.getElementById('footer').innerHTML = `
    <p> ${new Date().getFullYear()} – Marie Frech</p> 
`;

// Rendert alle Einträge aus dem Array (Sie zeigt alle Tagebuch-Einträge aus dem Array eintraege als HTML-Karten auf der Seite an.)
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

// Gibt passendes Emoji zur Stimmung zurück
function getEmoji(stimmung) {
    const emojis = { glücklich: '😊', neutral: '😐', traurig: '😢', wütend: '😠', aufgeregt: '😆'};
    return emojis[stimmung] || '';
}
// Neuer Eintrag
document.getElementById('eintrag-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Verhindert Neuladen der Seite
    const newEintrag = {
        datum: document.getElementById('datum').value,
        stimmung: document.getElementById('stimmung').value,
        notiz: document.getElementById('notiz').value
    };
    eintraege.push(newEintrag); // Fügt Eintrag zum Array hinzu
    saveToLocalStorage(); // SPeichert im LOcalStorage
    renderEintraege(); //Aktualisiert die Anzeige
    e.target.reset(); // Formular leeren
});

// Eintrag löschen
function deleteEintrag(index) {
    eintraege.splice(index, 1); // Entfernt 1 Element ab Position index
    saveToLocalStorage();
    renderEintraege();
}

// Eintrag bearbeiten 
function editEintrag(index) {
    const eintrag = eintraege[index];
    document.getElementById('datum').value = eintrag.datum;
    document.getElementById('stimmung').value = eintrag.stimmung;
    document.getElementById('notiz').value = eintrag.notiz;
    deleteEintrag(index); // Alten Eintrag entfernen
}