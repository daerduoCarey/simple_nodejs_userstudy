var express = require('express');
var fs = require('fs');
var router = express.Router();

var config = require('../../config.js');

const mysql = require('mysql');

const pool = mysql.createPool({
    host: config.db_host,
    user: config.db_user,
    password: config.db_passwd,
    database: config.db_name
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

/* GET submit answer */
router.get('/submit_answer/:struct/:geo/:all', function(req, res, next) {
    var struct = req.params.struct;
    var geo = req.params.geo;
    var all = req.params.all;
    
    pool.getConnection(function (error, connection) {
        if (error) {
            console.log('[ connect error ]');
            console.log(error);
            res.status(400).send('error');
            return;
        } else {
            console.log("[ database connected ]");
        }

        const query = 'INSERT INTO results (algAStruct, algAGeo, algAAll, algBStruct, algBGeo, algBAll, algCStruct, algCGeo, algCAll) ' +
            'VALUES ('+
            struct.charAt(0)+', '+geo.charAt(0)+', '+all.charAt(0)+', '+
            struct.charAt(1)+', '+geo.charAt(1)+', '+all.charAt(1)+', '+
            struct.charAt(2)+', '+geo.charAt(2)+', '+all.charAt(2)+');'

        console.log('[Get Info] mysql query: '+query);

        connection.query(query, function (error, results, field) {
            if (error) {
                console.log('[ error (threw) ]', error);
                res.status(400).send('error');
            } else {
                res.status(200).end();
            }
            connection.release();
        });
    });
});

/* GET image */
router.get('/get_img/:name/:sid', function(req, res, next) {
    var name = req.params.name;
    var sid = req.params.sid;
    console.log('Get img: ', name, sid);

    var fn_path = config.img_dir + '/' + name + '/data-'+sid+ '.png';
    
    fs.stat(fn_path, function(err, stat) {
          if(err == null) {
              console.log('[Get Model Img] fn_path: '+fn_path);
              res.status(200).download(fn_path);
          } else if(err.code === 'ENOENT') {
              console.log('[Get Model Img] fn_path: '+fn_path+' does not exist!');
              res.status(400).end();
          } else {
              console.log('[Get Model Img] fn_path: '+fn_pat+' Other Errors!');
              res.status(400).end();
          }
      });
});

module.exports = router;

