require('should');

describe('extract-json-from-string', function() {
  const extract = require('../lib/extract-json-from-string');

  describe('extract()', () => {
    context('with a single JSON object', () => {
      it('should return the object', () => {
        let objs = extract(`Here's an object ${JSON.stringify({ foo: 'bar' })} that should be extracted`);
        objs.length.should.equal(1);
        objs[0].should.eql({ foo: 'bar' });
      })
    })

    context('with a single object', () => {
      it('should return the object', () => {
        let objs = extract("Here's an object { foo: 'bar' } that should be extracted");
        objs.length.should.equal(1);
        objs[0].should.eql({ foo: 'bar' });
      })
    })

    context('with multiple JSON objects', () => {
      it('should return both objects', () => {
        let objs = extract(`Here's an object ${JSON.stringify({ foo: 'bar' })} that should be extracted as well as ${JSON.stringify({ baz: 'quux' })} this`);
        objs.length.should.equal(2);
        objs[0].should.eql({ foo: 'bar' });
        objs[1].should.eql({ baz: 'quux' });
      })
    })

    context('with multiple objects', () => {
      it('should return both objects', () => {
        let objs = extract("Here's an object { foo: 'bar' } that should be extracted as well as { baz: 'quux' } this");
        objs.length.should.equal(2);
        objs[0].should.eql({ foo: 'bar' });
        objs[1].should.eql({ baz: 'quux' });
      })
    })

    context('with nested objects', () => {
      it('should return the object', () => {
        let objs = extract("Here's an object { foo: { bar: { baz: 'quux' }, hello: { world: true } } } that should be extracted");
        objs.length.should.equal(1);
        objs[0].should.eql({
          foo: {
            bar: {
              baz: 'quux'
            },
            hello: {
              world: true
            }
          }
        });
      })
    })

    context('with a single JSON array', () => {
      it('should return the array', () => {
        let objs = extract(`Here's an array ${JSON.stringify(['foo', 'bar'])} that should be extracted`);
        objs.length.should.equal(1);
        objs[0].should.eql(['foo', 'bar']);
      })
    })

    context('with a single array', () => {
      it('should return the array', () => {
        let objs = extract("Here's an array ['foo', 'bar'] that should be extracted");
        objs.length.should.equal(1);
        objs[0].should.eql(['foo', 'bar']);
      })
    })

    context('with multiple JSON arrays', () => {
      it('should return both arrays', () => {
        let objs = extract(`Here's an array ${JSON.stringify(['foo', 'bar'])} that should be extracted as well as ${JSON.stringify(['baz', 'quux'])} this`);
        objs.length.should.equal(2);
        objs[0].should.eql(['foo', 'bar']);
        objs[1].should.eql(['baz', 'quux']);
      })
    })

    context('with multiple arrays', () => {
      it('should return both arrays', () => {
        let objs = extract("Here's an array ['foo', 'bar'] that should be extracted as well as ['baz', 'quux'] this");
        objs.length.should.equal(2);
        objs[0].should.eql(['foo', 'bar']);
        objs[1].should.eql(['baz', 'quux']);
      })
    })

    context('with nested arrays', () => {
      it('should return the array', () => {
        let objs = extract("Here's an array [ 'foo', [ 'bar', [ 'baz', 'quux' ], 'hello', [ 'world', true ] ] ] that should be extracted");
        objs.length.should.equal(1);
        objs[0].should.eql(['foo', ['bar', ['baz', 'quux'], 'hello', ['world', true ] ] ]);
      })
    })

    context('with a mix of arrays and objects', () => {
      it('should return the outer items', () => {
        let objs = extract(`Here's some ['foo', { bar: true }] things to ${JSON.stringify({ baz: 'quux', items: [1, 2, 3], nested: [{ property: { inArray: 1 } }]})} extract`);
        objs.length.should.equal(2);
        objs[0].should.eql(['foo', { bar: true }]);
        objs[1].should.eql({
          baz: 'quux',
          items: [1, 2, 3],
          nested:  [
            {
              property: {
                inArray: 1
              }
            }
          ]
        });
      })
    })

    context('with an invalid object', () => {
      it('should handle a start brace only', () => {
        let objs = extract('laskfjd laksdj fals { lkasjdf');
        objs.length.should.equal(0);
      })

      it('should handle a start brace and close brace that are not an object', () => {
        let objs = extract('laskfjd laksdj fals { lkasjdf }');
        objs.length.should.equal(0);
      })

      it('should handle a string with no braces at all', () => {
        let objs = extract('laskfjd laksdj fals lkasjdf');
        objs.length.should.equal(0);
      })

      it('should still return objects after invalid objects', () => {
        let objs = extract('laskfjd laksdj fals { lkasjdf } sakjd { foo: "bar" }');
        objs.length.should.equal(1);
        objs[0].should.eql({ foo: 'bar' });
      })
    })
  })

  describe('extract() with includeDetails parameter', () => {
    context('with a single JSON object', () => {
      it('should return the object with position information', () => {
        let text = `Here's an object ${JSON.stringify({ foo: 'bar' })} that should be extracted`;
        let objs = extract(text, true);
        
        objs.length.should.equal(1);
        objs[0].should.have.properties(['object', 'start', 'end', 'raw']);
        objs[0].object.should.eql({ foo: 'bar' });
        objs[0].start.should.equal(17);
        objs[0].end.should.equal(30);
        objs[0].raw.should.equal('{"foo":"bar"}');
      })
    })

    context('with a single object', () => {
      it('should return the object with position information', () => {
        let text = "Here's an object { foo: 'bar' } that should be extracted";
        let objs = extract(text, true);
        
        objs.length.should.equal(1);
        objs[0].should.have.properties(['object', 'start', 'end', 'raw']);
        objs[0].object.should.eql({ foo: 'bar' });
        objs[0].start.should.equal(17);
        objs[0].end.should.equal(31);
        objs[0].raw.should.equal("{ foo: 'bar' }");
      })
    })

    context('with multiple objects', () => {
      it('should return both objects with correct positions', () => {
        let text = 'First { a: 1 } and second { b: 2 } object';
        let objs = extract(text, true);
        
        objs.length.should.equal(2);
        
        // First object
        objs[0].object.should.eql({ a: 1 });
        objs[0].start.should.equal(6);
        objs[0].end.should.equal(14);
        objs[0].raw.should.equal('{ a: 1 }');
        
        // Second object
        objs[1].object.should.eql({ b: 2 });
        objs[1].start.should.equal(26);
        objs[1].end.should.equal(34);
        objs[1].raw.should.equal('{ b: 2 }');
      })
    })

    context('with arrays and objects mixed', () => {
      it('should return all items with correct positions', () => {
        let text = 'Array [1, 2] and object { name: \'test\' } here';
        let objs = extract(text, true);
        
        objs.length.should.equal(2);
        
        // Array
        objs[0].object.should.eql([1, 2]);
        objs[0].start.should.equal(6);
        objs[0].end.should.equal(12);
        objs[0].raw.should.equal('[1, 2]');
        
        // Object
        objs[1].object.should.eql({ name: 'test' });
        objs[1].start.should.equal(24);
        objs[1].end.should.equal(40);
        objs[1].raw.should.equal('{ name: \'test\' }');
      })
    })

    context('with nested structures', () => {
      it('should return the outer structure with correct positions', () => {
        let text = 'Complex { outer: { inner: 42 } } structure';
        let objs = extract(text, true);
        
        objs.length.should.equal(1);
        objs[0].object.should.eql({ outer: { inner: 42 } });
        objs[0].start.should.equal(8);
        objs[0].end.should.equal(32);
        objs[0].raw.should.equal('{ outer: { inner: 42 } }');
      })
    })

    context('with nested arrays', () => {
      it('should return the array with correct positions', () => {
        let text = 'Here\'s an array [ \'foo\', [ \'bar\', [ \'baz\', \'quux\' ], \'hello\' ] ] that should be extracted';
        let objs = extract(text, true);
        
        objs.length.should.equal(1);
        objs[0].object.should.eql(['foo', ['bar', ['baz', 'quux'], 'hello']]);
        objs[0].start.should.equal(16);
        objs[0].end.should.equal(64);
        objs[0].raw.should.equal('[ \'foo\', [ \'bar\', [ \'baz\', \'quux\' ], \'hello\' ] ]');
      })
    })

    context('with no valid objects', () => {
      it('should return empty array', () => {
        let text = 'No objects here, just plain text';
        let objs = extract(text, true);
        
        objs.length.should.equal(0);
        objs.should.be.an.Array();
      })
    })

    context('with invalid JSON structures', () => {
      it('should skip invalid structures and continue', () => {
        let text = 'Invalid { broken and valid { foo: \'bar\' } object';
        let objs = extract(text, true);
        
        objs.length.should.equal(0);
      })

      it('should skip invalid structures but extract valid ones after', () => {
        let text = 'Invalid { broken } but valid { working: true } here';
        let objs = extract(text, true);
        
        objs.length.should.equal(1);
        objs[0].object.should.eql({ working: true });
        objs[0].start.should.equal(29);
        objs[0].end.should.equal(46);
        objs[0].raw.should.equal('{ working: true }');
      })
    })

    context('with a mix of arrays and objects', () => {
      it('should return the outer items with positions', () => {
        let objs = extract(`Here's some ['foo', { bar: true }] things to ${JSON.stringify({ baz: 'quux', items: [1, 2, 3], nested: [{ property: { inArray: 1 } }]})} extract`, true);
        
        objs.length.should.equal(2);
        objs[0].object.should.eql(['foo', { bar: true }]);
        objs[0].start.should.equal(12);
        objs[0].end.should.equal(34);
        objs[0].raw.should.equal("['foo', { bar: true }]");
        
        objs[1].object.should.eql({
          baz: 'quux',
          items: [1, 2, 3],
          nested: [
            {
              property: {
                inArray: 1
              }
            }
          ]
        });
        objs[1].start.should.equal(45);
        objs[1].end.should.equal(113);
      })
    })

    context('checking compatibility with normal mode', () => {
      it('should return same objects when includeDetails is false', () => {
        let text = 'Object { test: \'value\' } and array [1, 2, 3]';
        
        let normalResult = extract(text);
        let detailedResult = extract(text, false);
        
        normalResult.should.eql(detailedResult);
        normalResult.length.should.equal(2);
        normalResult[0].should.eql({ test: 'value' });
        normalResult[1].should.eql([1, 2, 3]);
      })

      it('should return different structure when includeDetails is true', () => {
        let text = 'Object { test: \'value\' } here';
        
        let normalResult = extract(text);
        let detailedResult = extract(text, true);
        
        normalResult.should.not.eql(detailedResult);
        normalResult.should.eql([{ test: 'value' }]);
        detailedResult.should.be.an.Array();
        detailedResult[0].should.have.properties(['object', 'start', 'end', 'raw']);
        detailedResult[0].object.should.eql({ test: 'value' });
      })
    })
  })
})
