
var test       = require('tap').test
  , testCommon = require('./testCommon')
  , MysqlDOWN    = require('./mysqldown')
  , testBuffer = require('fs').readFileSync(require('path').join(__dirname, 'testdata.bin'))

  , factory    = function (location) {
      return new MysqlDOWN(location)
    }

/*** compatibility with basic LevelDOWN API ***/

require('abstract-leveldown/abstract/leveldown-test').args(factory, test, testCommon)

require('abstract-leveldown/abstract/open-test').args(factory, test, testCommon)
require('abstract-leveldown/abstract/open-test').open(factory, test, testCommon)

require('abstract-leveldown/abstract/put-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/del-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/get-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/put-get-del-test').all(factory, test, testCommon, testBuffer)

require('abstract-leveldown/abstract/iterator-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/batch-test').all(factory, test, testCommon)
require('abstract-leveldown/abstract/chained-batch-test').all(factory, test, testCommon)

require('abstract-leveldown/abstract/close-test').close(factory, test, testCommon)

// require('abstract-leveldown/abstract/approximate-size-test').setUp(factory, test, testCommon)
// require('abstract-leveldown/abstract/approximate-size-test').args(factory, test, testCommon)
