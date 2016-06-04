/**
 * Created by john on 6/4/16.
 */
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('redirect.db');
var check;
db.serialize(function() {

    db.run("CREATE TABLE if not exists user_redirect (user TEXT, user_to TEXT)");
    var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
});

db.close();