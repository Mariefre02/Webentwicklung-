// Datenmodell
// 1. Lädt gespeicherte Einträge aus dem LocalStorage oder initialisiert ein leeres Array
//let eintraege = JSON.parse(localStorage.getItem('eintraege')) || [];
let eintraege = [];
//Take entries from database
async function fetchAndLogData() {
    const data = await sendJsonWithGET('http://localhost:3000');
    return data;
}
async function readDB() {
    eintraege = await fetchAndLogData();
    console.log(eintraege);
    renderEintraege();
}

readDB();

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
                <button onclick="editEintrag(${index}, event)">Bearbeiten</button>
                <button onclick="deleteEintrag(${index})">Löschen</button>  
            </div>
        </article>
    `).join(''); // Klausur addEventListener 
}

// Gibt passendes Emoji zur Stimmung zurück
function getEmoji(stimmung) {
    const emojis = { glücklich: '😊', neutral: '😐', traurig: '😢', wütend: '😠', aufgeregt: '😆' };
    return emojis[stimmung] || '';
}
// Neuer Eintrag (Speichert neue einträge)
document.getElementById('eintrag-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Verhindert Neuladen der Seite
    const newEintrag = {
        datum: document.getElementById('datum').value,
        stimmung: document.getElementById('stimmung').value,
        notiz: document.getElementById('notiz').value
    };

    if (window.editingIndex !== undefined) {
        // Update existing entry
        const id = eintraege[window.editingIndex].id;
        newEintrag.id = id;
        eintraege[window.editingIndex] = newEintrag;
        sendJsonWithDelete('http://localhost:3000/', JSON.stringify({ id }));
        sendJsonWithPOST('http://localhost:3000/', JSON.stringify({ newEintrag }));
        delete window.editingIndex; // clear edit state
    } else {
        // New entry
        eintraege.push(newEintrag);
        sendJsonWithPOST('http://localhost:3000/', JSON.stringify({ newEintrag }));
    }

    /*
    eintraege.push(newEintrag); // Fügt Eintrag zum Array hinzu
    sendJsonWithPOST(
        'http://localhost:3000/',
        JSON.stringify({ newEintrag })
    );
    */
    //saveToLocalStorage(); // Speichert im LOcalStorage
    e.target.reset(); // Formular leeren
});
/*
// Eintrag löschen
function deleteEintrag(index) {
    eintraege.splice(index, 1); // Entfernt 1 Element ab Position index
    saveToLocalStorage();
    renderEintraege();
}
*/
function deleteEintrag(index) {
    const id = eintraege[index].id;
    sendJsonWithDelete('http://localhost:3000/', JSON.stringify({ id }));
    renderEintraege();
}

// Eintrag bearbeiten 
function editEintrag(index, event) {
    const eintrag = eintraege[index];
    const id = eintrag.id;
    console.log(eintrag);
    document.getElementById('datum').value = eintrag.datum;
    document.getElementById('stimmung').value = eintrag.stimmung;
    document.getElementById('notiz').value = eintrag.notiz;
    //sendJsonWithDelete('http://localhost:3000/', JSON.stringify({ id }));
    window.editingIndex = index;
}

/*
*
* Serverzeug
*
*/

async function sendJsonWithDelete(url, jsonString) {
    const response = await fetch(url, {
        method: 'delete',
        body: jsonString, //send id of block to server
        headers: {
            'Content-Type': 'application/json',  // tell server you send JSON
        },
    });
}
async function sendJsonWithPOST(url, jsonString) {
    const response = await fetch(url, {
        method: 'post',
        body: jsonString, //new entry with note mood and date
    });
}
async function sendJsonWithGET(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}
