
module.exports = function getters (schema, options) {
  schema.statics.getById = function (id, options, callback) {
    var Model = this,
        query = Model.findById(id);

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    applyOptions(query, options);
    executeQuery(query, callback);
  };

  schema.statics.getByIds = function (ids, options, callback) {
    var Model = this,
        query = Model.find();

    if (typeof options === "function") {
      callback = options;
      options = {};
    }

    if (ids.length > 0) {
      var idsQuery = ids.map(function(id) {
            return {_id: id};
          });

      applyOptions(query, options);
      query.or(idsQuery);
      executeQuery(query, callback);
    } else {
      return callback(null, []);
    }
  };

  schema.statics.getByField = function (fieldValueMap, options, callback) {
    var Model = this,
        query = Model.find(fieldValueMap);

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    applyOptions(query, options);
    executeQuery(query, callback);
  };

  schema.statics.getOneByField = function (fieldValueMap, options, callback) {
    var Model = this,
        query = Model.findOne(fieldValueMap);

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    applyOptions(query, options);
    executeQuery(query, callback);
  };

  schema.statics.getAll = function (options, callback) {
    var Model = this,
        query = Model.find();

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    applyOptions(query, options);
    executeQuery(query, callback);
  };

  function applyOptions (query, options) {
    options = options || {};

    if (options.lean) {
      query.lean();
    }

    if (options.select) {
      query.select(options.select);
    }

    if (options.nin) {
      query.nin(options.nin.path, options.nin.value);
    }

    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach(function (populate) {
          applyPopulate(query, populate);
        });
      } else {
        applyPopulate(query, options.populate);
      }
    }

    return query;
  }

  function applyPopulate (query, populate) {
    if (typeof populate === "object") {
      query.populate(populate.path, populate.select);
    } else {
      query.populate(populate);
    }

    return query;
  }

  function executeQuery (query, callback) {
    query.exec(function (err, result) {
      if (!err) {
        return callback(err, result);
      } else {
        console.log(err);

        return callback(err, result);
      }
    });

    return query;
  }
};