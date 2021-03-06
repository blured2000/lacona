var Element = function(options) {
  this.id = typeof options.id === 'undefined' ? '@temp-' + (Element.tempId) : options.id;
  Element.tempId++;
  this.optional = typeof options.optional === 'undefined' ? false : options.optional;
};

Element.tempId = 0;

Element.prototype.parse = function(input, lang, context, data, done) {
  if (this.optional) {
    data(input);
  }
  return this.handleParse(input, lang, context, data, done);
};

Element.prototype.handleParse = function(input, lang, context, data, done) {
  done(Error('You must override abstract method handleParse'));
};

module.exports = Element;

