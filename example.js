var MysqlDOWN = require('./')
  , levelup = require('levelup')
  , factory = function (location) { return new MysqlDOWN(location) }
  , db = levelup(
        'mysql://user:password@host:port/database/table'
      , { db: factory }
    )

db.put('beep', 'boop')
db.put('foo', 'bar')

db.createReadStream()
  .on('data', console.log)
  .on('close', function () { console.log('it is over now') })
