// Built-in Node.js modules
let fs = require('fs');
let path = require('path');
var cors = require('cors');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');
let dotenv = require('dotenv');

dotenv.config();

let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
let port = process.env.PORT;

app.use(express.json());
app.use(cors());

// Open SQLite3 database (in read-only mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log('Error opening ' + path.basename(db_filename));
  } else {
    console.log('Now connected to ' + path.basename(db_filename));
  }
});

// GET request handler for crime codes
app.get('/codes', (req, res) => {
  // console.log(req.query); // query object (key-value pairs after the ? in the url)
  // console.log(Object.entries(req.query).length); // query object (key-value pairs after the ? in the url)

  let query = 'SELECT * FROM Codes ORDER BY code ASC';
  if (Object.entries(req.query).length == 0) {
    databaseSelect(query)
      .then((rows) => {
        // console.log(rows);
        res.status(200).type('json').send(rows);
      })
      .catch((err) => {
        // console.log('ERROR: ' + err);
        res
          .status(500)
          .type('text')
          .send('Error: ' + err);
      });
  } else {
    let codes = req.query.code.split(',');
    // console.log(codes);
    query = 'SELECT * FROM Codes WHERE code = ?';

    for (let i = 1; i < codes.length; i++) {
      query += ' OR code = ?';
    }

    query += ' ORDER BY code ASC';

    // console.log('LONG QUERY: ' + query);

    databaseSelect(query, codes)
      .then((rows) => {
        // console.log(rows);
        res.status(200).type('json').send(rows);
      })
      .catch((err) => {
        // console.log('ERROR: ' + err);
        res
          .status(500)
          .type('text')
          .send('Error: ' + err);
      });
  }
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
  // console.log(req.query); // query object (key-value pairs after the ? in the url)

  let query = 'SELECT * FROM Neighborhoods ORDER BY neighborhood_number ASC';
  if (Object.entries(req.query).length == 0) {
    databaseSelect(query)
      .then((rows) => {
        res.status(200).type('json').send(rows);
      })
      .catch((err) => {
        // console.log('ERROR: ' + err);
        res
          .status(500)
          .type('text')
          .send('Error: ' + err);
      });
  } else {
    let neighborhoods = req.query.id.split(',');
    query = 'SELECT * FROM Neighborhoods WHERE neighborhood_number = ?';

    for (let i = 1; i < neighborhoods.length; i++) {
      query += ' OR neighborhood_number = ?';
    }

    query += ' ORDER BY neighborhood_number ASC';

    // console.log('LONG QUERY: ' + query);

    databaseSelect(query, neighborhoods)
      .then((rows) => {
        // console.log(rows);
        res.status(200).type('json').send(rows);
      })
      .catch((err) => {
        // console.log('ERROR: ' + err);
        res
          .status(500)
          .type('text')
          .send('Error: ' + err);
      });
  }

  // res.status(200).type('json').send({}); // <-- you will need to change this
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
  // console.log(req.query); // query object (key-value pairs after the ? in the url)

  let query = 'SELECT * FROM Incidents ORDER BY date_time DESC LIMIT 1000';
  if (Object.entries(req.query).length == 0) {
    databaseSelect(query)
      .then((rows) => {
        //separate date and time
        for (let i = 0; i < rows.length; i++) {
          let split = rows[i].date_time.split('T');
          rows[i].date = split[0];
          rows[i].time = split[1];
          delete rows[i].date_time;
        }
        res.status(200).type('json').send(rows);
      })
      .catch((err) => {
        // console.log('ERROR: ' + err);
        res
          .status(500)
          .type('text')
          .send('Error: ' + err);
      });
  } else {
    let first = true;
    let params = [];
    // console.log(req.query);

    let query = 'SELECT * FROM Incidents';
    if (req.query.hasOwnProperty('start_date')) {
      params.push(req.query.start_date);
      if (first) {
        query += ' WHERE date(date_time) >= ?';
        first = false;
      } else {
        query += ' AND date(date_time) >= ?';
      }
    }
    if (req.query.hasOwnProperty('end_date')) {
      params.push(req.query.end_date);
      if (first) {
        query += ' WHERE date(date_time) <= ?';
        first = false;
      } else {
        query += ' AND date(date_time) <= ?';
      }
    }
    if (req.query.hasOwnProperty('code')) {
      let firstCode = true;
      let codes = req.query.code.split(',');
      // console.log('CODES:');
      // console.log(codes);
      for (let i = 0; i < codes.length; i++) {
        params.push(codes[i]);
        if (firstCode) {
          if (first) {
            query += ' WHERE code IN (?';
            first = false;
            firstCode = false;
          } else {
            query += ' AND code IN (?';
            firstCode = false;
          }
        } else {
          query += ', ?';
        }
      }
      query += ')';
    }
    if (req.query.hasOwnProperty('grid')) {
      let firstGrid = true;
      let grids = req.query.grid.split(',');
      // console.log('GRIDS:');
      // console.log(grids);
      for (let i = 0; i < grids.length; i++) {
        params.push(grids[i]);
        if (firstGrid) {
          if (first) {
            query += ' WHERE police_grid IN (?';
            first = false;
            firstGrid = false;
          } else {
            query += ' AND police_grid IN (?';
            firstGrid = false;
          }
        } else {
          query += ', ?';
        }
      }
      query += ')';
    }
    if (req.query.hasOwnProperty('neighborhood')) {
      let firstNeighborhood = true;
      let neighborhoods = req.query.neighborhood.split(',');
      // console.log('Neighborhoods:');
      // console.log(neighborhoods);
      for (let i = 0; i < neighborhoods.length; i++) {
        params.push(neighborhoods[i]);
        if (firstNeighborhood) {
          if (first) {
            query += ' WHERE neighborhood_number IN (?';
            first = false;
            firstNeighborhood = false;
          } else {
            query += ' AND neighborhood_number IN (?';
            firstNeighborhood = false;
          }
        } else {
          query += ', ?';
        }
      }
      query += ')';
    }
    // console.log('  ' + params);
    query += ' ORDER BY date_time DESC';
    if (req.query.hasOwnProperty('limit')) {
      params.push(req.query.limit);
      query += ' LIMIT ?';
    } else {
      query += ' LIMIT 1000';
    }
    // console.log(query);
    databaseSelect(query, params)
      .then((rows) => {
        // console.log(rows);
        // console.log(query);
        for (let i = 0; i < rows.length; i++) {
          let split = rows[i].date_time.split('T');
          rows[i].date = split[0];
          rows[i].time = split[1];
          delete rows[i].date_time;
        }
        res.status(200).type('json').send(rows);
      })
      .catch((err) => {
        // console.log(err);
        res
          .status(400)
          .type('text')
          .send('ERROR: ' + err);
      });
  }

  // res.status(200).type('json').send({}); // <-- you will need to change this
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
  databaseSelect('SELECT * FROM Incidents WHERE case_number = ?', req.body.case_number)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(500).type('text').send('The case number already exists');
      } else {
        var { case_number, date, time, code, incident, police_grid, neighborhood_number, block } = req.body;
        var insertQuery =
          'INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block) VALUES (?, ?, ?, ?, ?, ?, ?);';
        databaseRun(insertQuery, [
          case_number,
          date + 'T' + time,
          code,
          incident,
          police_grid,
          neighborhood_number,
          block,
        ])
          .then(() => {
            res.status(200).type('text').send('Uploaded successfully');
          })
          .catch((err) => {
            res
              .status(400)
              .type('text')
              .send('ERROR: ' + err);
          });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .type('text')
        .send('ERROR: ' + err);
    });
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
  databaseSelect('SELECT * FROM Incidents WHERE case_number = ?', req.body.case_number)
    .then((rows) => {
      if (rows.length === 0) {
        res.status(500).type('text').send('The case number does not exist');
      } else {
        databaseRun('DELETE FROM Incidents WHERE case_number = ?', req.body.case_number)
          .then(() => {
            res.status(200).type('text').send('Deleted successfully');
          })
          .catch((err) => {
            res
              .status(400)
              .type('text')
              .send('ERROR: ' + err);
          });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .type('text')
        .send('ERROR: ' + err);
    });
});

// Create Promise for SQLite3 database SELECT query
function databaseSelect(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Create Promise for SQLite3 database INSERT or DELETE query
function databaseRun(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Start server - listen for client connections
app.listen(port, () => {
  console.log('Now listening on port ' + port);
});
