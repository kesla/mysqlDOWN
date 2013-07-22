
var util              = require('util')
  , url               = require('url')

  , AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
  , mysql             = require('mysql')

  , sqlHelper         = require('./sql')
  , MysqlIterator     = require('./mysqliterator')
  , setImmediate      = global.setImmediate || process.nextTick

// constructor, passes through the 'location' argument to the AbstractLevelDOWN constructor
function MysqlDOWN (location) {
  AbstractLevelDOWN.call(this, location)

  this.pool = mysql.createPool({
      host: '127.0.0.1'
    , user: 'root'
    , password: ''
    , multipleStatements: true
  })

  this.database = location.split('/')[0]
  this.table = location.split('/')[1]
}

// our new prototype inherits from AbstractLevelDOWN
util.inherits(MysqlDOWN, AbstractLevelDOWN)

MysqlDOWN.prototype._query = function(query, callback) {
  this.pool.getConnection(function(err, connection) {
    if (err)
      callback(err)
    else
      connection.query(
          query
        , function(err, result) {
            connection.end()
            callback(err, result)
          }
      )
  })
}

MysqlDOWN.prototype._streamingQuery = function(query, callback) {
  this.pool.getConnection(function(err, connection) {
    var stream

    if (err)
      callback(err)
    else {
      stream = connection.query(query).stream({highWaterMark: 100})
      stream.once('end', function() {
        connection.end()
      })
      callback(null, stream)
    }
  })
}

MysqlDOWN.prototype._parseValue = function(array, asBuffer) {
  asBuffer = (asBuffer === undefined) ? true : asBuffer
  return asBuffer ? array[0].value : array[0].value.toString()
}

MysqlDOWN.prototype._open = function(options, callback) {
  var self = this

  this._query(
      sqlHelper.createDatabaseAndTable(this.database, this.table)
    , function(err) {
        if (err)
          callback(err)
        else {
          self.pool.config.connectionConfig.database = self.database
          callback(null)
        }
      }
  )
}

MysqlDOWN.prototype._close = function(callback) {
  this.pool.end(callback)
}

MysqlDOWN.prototype._put = function(key, value, options, callback) {
  this._query(sqlHelper.insertInto(this.table, key, value), callback)
}

MysqlDOWN.prototype._get = function(key, options, callback) {
  var self = this

  this._query(sqlHelper.selectByKey(this.table, key), function(err, obj) {
    if (!err && obj.length === 0)
      err = new Error('notFound')

    if (err)
      callback(err)
    else {
      callback(null, self._parseValue(obj, options.asBuffer))
    }
  })
}

MysqlDOWN.prototype._del = function(key, options, callback) {
  this._query(sqlHelper.deleteFrom(this.table, key), callback)
}

MysqlDOWN.prototype._batch = function(array, options, callback) {
  var self = this

    , query = array
      .map(function(elm) {
        return (elm.type === 'del') ?
          sqlHelper.deleteFrom(self.table, elm.key)
          :
          sqlHelper.insertInto(self.table, elm.key, elm.value)
      })
      .join(';\n')

  if (array.length === 0)
    setImmediate(callback)
  else
    this._query(query, callback)
}

MysqlDOWN.prototype._iterator = function(options) {
  return new MysqlIterator(this, options)
}

module.exports = MysqlDOWN
