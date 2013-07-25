# mysqlDOWN

## wtf is this?

mysqlDOWN is a mad science experience building a mysql-wrapper around leveldown, so that it can be used in levelup. It's also a way for me to remember how to write sql.

## Stability

Really unstable. I'm not a pro sql-guy, so lot's of things might be really badly done. But hey, it sort of works... So that's badass.

## Usage

```js
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
```

## Licence
MIT