
module.exports = jsonSource;

function jsonSource(table, supportsWrite) {

  var data;
  function getData(callback) {
    if (data) return callback(null, data);
  }
  var source = {};

  source.getID = getID;
  function getID(record) {
    return record.id;
  };

  source.count = count;
  function count(callback) {
    getData(function (err, res) {
      if (err) return callback(err);
      callback(null, res.length);
    });
  };

  source.getRows = getRows;
  function getRows(options, callback) {
    getData(function (err, res) {
      if (err) return callback(err);
      var hasMore = false;
      try {

        //Filter the array first, This could remove lots of elements before sorting so great for performance.
        if (options.filter) {
          if (typeof options.filter !== 'string') throw new Error('Filter type "' + (typeof options.filter) + '" is not supported');
          res = res.filter(function (record) {
            return JSON.stringify(record).indexOf(options.filter);
          });
        }

        //We have to sort before we page, or we'd be getting random elements in our page
        if (options.sort) {
          if (typeof options.sort !== 'object') throw new Error('Sort type "' + (typeof options.sort) + '" is not supported');
          if (typeof options.sort.field !== 'string' || typeof options.sort.order !== 'string') throw new Error('Sort type "' + JSON.stringify(options.sort) + '" is not supported');
          if (typeof options.sort.order !== 'ascending' & typeof options.sort.order !== 'descending') throw new Error('Sort order "' + (options.sort.order) + '" is not supported');

          var comp = compare(options.sort.field);
          if (options.sort.order === 'descending') comp = reverseCompare(comp);

          res = res.sort(comp);
        }

        //Page the data at the end
        if (options.page) {
          if (typeof options.page !== 'object') throw new Error('Page type "' + (typeof options.page) + '" is not supported');
          if (typeof options.page.startIndex !== 'number' || typeof options.page.count !== 'number') throw new Error('Page type "' + JSON.stringify(options.page) + '" is not supported');
          var output = [];
          for (var i = options.page.startIndex; i < res.length && i < (options.page.startIndex + options.page.count); i++) {
            output.push(res[i]);
          }
          if (i < res.length) hasMore = true;
          res = output;
        }
      } catch (ex) {
        return callback(ex);
      }
      callback(null, res, hasMore);
    });
  };

  return source;
}

function compare(field) {
  return function compare(a, b) { // greater than 0 to sort b before a, less than 0 to sort a before b
    if (typeof a === 'string') return a.localeCompare(b);
    return a > b ? 1 : -1;
  };
}


function reverseCompare(fn) {
  return function (a, b) {
    return fn(a, b) * -1;
  };
}

function isArray(arr) {
  return typeof arr === 'object' &&
    typeof arr.length === 'number' &&
    typeof arr.filter === 'function' &&
    typeof arr.sort === 'function';
}