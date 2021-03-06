module.exports = {
  scope: {
    literal: function(inputString, data, done) {
      data({
        display: this.display,
        value: this.value
      });
      return done();
    }
  },
  phrases: [{
    name: 'literal',
    root: {
      type: 'value',
      compute: 'literal',
      id: '@value'
    }
  }]
};