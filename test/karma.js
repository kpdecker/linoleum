import karma from '../src/karma';

describe('karma config', function() {
  it('should generate config', function() {
    // Success is not throwing at this point. The simple karma tests
    // will do the actual verification
    karma({set() {}});
  });
});
