const http = require('http');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

// SQLite Datei angeben
const dbFilePath = 'eintrage.db';

// Funktion, um auf die Datenbank zuzugreifen
async function getDB() {
  const db = await sqlite.open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });
  return db;
}


const hostname = '127.0.0.1';
const port = 3000;

// Serverfunktion als async IIFE
(async () => {
  const db = await getDB();

  const server = http.createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log('Request received:', request.method, request.url);
    if (request.method === 'GET') {
      response.setHeader('Content-Type', 'application/json');

      try {
        const rows = await db.all('SELECT id, datum, stimmung, notiz FROM tbl');
        response.writeHead(200);
        response.end(JSON.stringify(rows));
      } catch (err) {
        console.error('Fehler beim Abrufen:', err.message);
        response.writeHead(500);
        response.end(JSON.stringify({ error: 'Fehler beim Abrufen der Daten' }));
      }
    }
    if (request.method === 'OPTIONS') {
      response.writeHead(204);
      return response.end();
    }
    if (request.method === 'POST') {
      let jsonString = '';
      request.on('data', (data) => {
        jsonString += data;
      });

      request.on('end', async () => {
        try {
          console.log(JSON.parse(jsonString))
          let sentEntry = JSON.parse(jsonString);
          sentEntry = sentEntry.newEintrag;

          const date = sentEntry.datum;
          const mood = sentEntry.stimmung;
          const note = sentEntry.notiz;

          await db.run(
            'INSERT INTO tbl (datum, stimmung, notiz) VALUES (?, ?, ?)',
            [date, mood, note]
          );
        } catch (err) {
          console.error('Fehler beim Speichern:', err.message);
        }
      });
    }
    if (request.method === 'DELETE') {
      let jsonString = '';
      request.on('data', (data) => {
        jsonString += data;
      });
      
      request.on('end', async () => {
        try {
          const data = JSON.parse(jsonString);
          console.log(data);
          
          const { id } = data;
          await db.run('DELETE FROM tbl WHERE id = ?', [id]);
    
          response.writeHead(200);
          response.end('Eintrag gelöscht');
        } catch (err) {
          console.error('Fehler beim Löschen:', err);
          response.writeHead(500);
          response.end('Fehler beim Löschen');
        }
      });
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();
