
var mysql = require('mysql')

module.exports = {
    createDatabaseAndTable: function(databaseName, tableName) {
      return [
          'CREATE DATABASE IF NOT EXISTS ' + databaseName + ';'
        , 'USE ' + databaseName + ';'
        , 'CREATE TABLE IF NOT EXISTS ' + tableName + ' ('
          , '`id` int(11) NOT NULL AUTO_INCREMENT,'
          , '`value` blob,'
          , '`key` blob,'
          , 'PRIMARY KEY (`id`),'
          , 'UNIQUE KEY `key` (`key`(767))'
        , ') ENGINE=InnoDB DEFAULT CHARSET=utf8;'
      ].join('\n')
    }

  , insertInto: function(tableName, key, value) {
      var escaped = mysql.escape({
          key: key
        , value: value
      })

      return [
          'INSERT INTO ' + tableName + ' SET ' + escaped
        , 'ON DUPLICATE KEY UPDATE ' + escaped
      ].join('\n')
    }

  , selectByKey: function(tableName, key) {
      key = mysql.escape(key)
      return 'SELECT `value` FROM ' + tableName + ' WHERE `key`=' + key
    }

  , deleteFrom: function(tableName, key) {
      key = mysql.escape(key)
      return 'DELETE FROM ' + tableName + ' WHERE `key`=' + key
    }
}
