var _ = require('lodash');

//function normalizeVersionedObject
// if object is an array, returns {value: '0.0.0', ...}
// if object is an object, returns object
// else, returns {}
function normalizeVersionedObject(object) {
  if (_.isArray(object)) {
    return _.reduce(object, function (acc, value) {
      acc[value] = '0.0.0';
      return acc;
    }, {});

  } else if (_.isObject(object)) {
    return object;

  } else {
    return {};

  }
}

var Phrase = function(options, scope, elementFactory) {
  var schema;
  var lang;
  var langs;
  var i, j, schemaLength, langLength;

  this.name = options.name;
  this.version = options.version || '0.0.0';
  this.evaluate = options.evaluate;
  this.scope = scope;

  this.inherits = normalizeVersionedObject(options.inherits);
  this.precedes = normalizeVersionedObject(options.precedes);
  this.schemas = {};

  //if they did not supply a schema, then assume they supplied a root and use that with the default lang
  if (!options.schemas) {
    options.schemas = [{
      langs: ['default'],
      root: options.root
    }];
  }

  for (schemaLength = options.schemas ? options.schemas.length : 0, i = 0; i < schemaLength; i++) {
    schema = options.schemas[i];
    langs = schema.langs;

    for (langLength = langs.length, j = 0; j < langLength; j++) {
      lang = langs[j];
      this.schemas[lang] = elementFactory(schema.root);
    }
  }

};

function getBestSchema(schemas, langs) {
  var i, l;
  var schema;

  //loop through langs, seeing if any schemas are an exact match.
  //if they are, we're done
  for (l = langs.length, i = 0; i < l; i++) {
    schema = schemas[langs[i]];
    if (schema) {
      break;
    }
  } 
  if (schema) {
    return schema;
  }

  //loop through langs, seeing if any schemas match the root
  for (i = 0; i < l; i++) {
    schema = schemas[langs[i].split('_')[0]];
    if (schema) {
      break;
    }
  } 
  if (schema) {
    return schema;
  }
  return schemas['default'];
}

Phrase.prototype.parse = function(input, langs, context, data, done) {

  var node = getBestSchema(this.schemas, langs);

  var nodeData = function(result) {
    var newResult;
    newResult = result.clearTemps();
    return data(newResult);
  };

  node.parse(input, langs, context, nodeData, done);
};

Phrase.prototype.getValue = function(options, result, done) {
  if (typeof this.evaluate !== 'undefined') {
    return this.scope[this.evaluate].call(options, result, done);
  } else {
    return done(null, result['@value']);
  }
};

module.exports = Phrase;
