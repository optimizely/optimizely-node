jest.dontMock('../lib/utils');

describe('encode js object as url param', function() {
  it('converts nested js object to url param', function() {
    var utils = require('../lib/utils');
    var obj = {
      foo: "hi there",
      bar: {
        blah: 123,
        quux: [1, 2, 3]
      }
    };

    var expectedOut = 'foo=hi%20there&bar%5Bblah%5D=123&bar%5Bquux%5D%5B0%5D=1&bar%5Bquux%5D%5B1%5D=2&bar%5Bquux%5D%5B2%5D=3';

    expect(utils.createRequestData(obj)).toBe(expectedOut);
  });
});

