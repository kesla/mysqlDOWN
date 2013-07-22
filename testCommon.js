
const mysql     = require('mysql')
    , connection = mysql.createConnection({
          user: 'root'
        , password: ''
      })
var dbidx = 0

  , location = function () {
      return 'leveldown_test/_db_test_' + dbidx++
    }

  , lastLocation = function () {
      return 'leveldown_test/_db_test_' + dbidx
    }

  , cleanup = function (callback) {
      connection.query(
          'drop database leveldown_test'
        , function(err, results) {
            if (err && err.code === 'ER_DB_DROP_EXISTS')
              callback(null)
            else
              callback(err)
          }
      )
    }

  , setUp = function (t) {
      cleanup(function (err) {
        t.notOk(err, 'cleanup returned an error')
        t.end()
      })
    }

  , tearDown = function (t) {
      // unref to make process die even if there's a mysql-connection open
      connection._socket.unref()
      t.end()
    }

  , collectEntries = function (iterator, callback) {
      var data = []
        , next = function () {
            iterator.next(function (err, key, value) {
              if (err) return callback(err)
              if (!arguments.length) {
                return iterator.end(function (err) {
                  callback(err, data)
                })
              }
              if (key == +key) key = +key
              data.push({ key: key, value: value })
              process.nextTick(next)
            })
          }
      next()
    }

module.exports = {
    location       : location
  , cleanup        : cleanup
  , lastLocation   : lastLocation
  , setUp          : setUp
  , tearDown       : tearDown
  , collectEntries : collectEntries
}
