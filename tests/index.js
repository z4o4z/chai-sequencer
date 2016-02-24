"use strict";

let chai        = require('chai');
let expect      = chai.expect;
let sequencer   = require("../index");
let EventEmitter = require('events');

chai.use(sequencer);

let ee = new EventEmitter();

describe('sequencer', function() {

    beforeEach(function() {
        ee.on('test1', () => console.log('test1 called'))
    });

    afterEach(function() {
        ee.removeAllListeners();
    });


    it('quick test', function () {
        ee.emit('test1');
        ee.emit('test2');
        ee.emit('test3');
        ee.emit('test4');
        ee.emit('test4');
        ee.emit('test6');
        ee.emit('test8');
        ee.emit('test9');

        expect(ee).to
            .emit('test1')
            .next('test2')
            .next.skip(2)
            .next.calls(2)
            .next('test6')
            .next.oneOf('test5', 'test6', 'test7')
            .next('test8')
            .next.last('test9');
    });
});