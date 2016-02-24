"use strict";

let EventEmitter = require('events');

require('./events.js');

module.exports = function sequencer (chai, utils) {
    let Assertion = chai.Assertion;

    // check the first event
    Assertion.addMethod('emit', emit);

    function emit (eEvent) {
        return new Emit(this._obj, eEvent);
    }

    function Emit (ee, eEvent) {
        this.ee = ee;

        checkEventName(eEvent);
        checkInstance(this.ee);

        let event = this.ee.__getCurrentEvent__();

        checkCurrentEvent(event);
        checkEqualEvent(eEvent, event);

        this.next.oneOf     = oneOf.bind(this);
        this.next.skip      = skip.bind(this);
        this.next.calls     = calls.bind(this);
        this.next.last      = last.bind(this);
        this.next.not       = not.bind(this);
        this.next.notOneOf  = notOneOf.bind(this);

        this.allCalls.oneOf     = oneOf.bind(this);
        this.allCalls.skip      = skip.bind(this);
        this.allCalls.calls     = calls.bind(this);
        this.allCalls.last      = last.bind(this);
        this.allCalls.not       = not.bind(this);
        this.allCalls.notOneOf  = notOneOf.bind(this);
    }

    Emit.prototype.next = function (eEvent) {
        checkEventName(eEvent);
        checkInstance(this.ee);

        let event = this.ee.__getNextEvent__();

        console.log(event);

        checkCurrentEvent(event);
        checkEqualEvent(eEvent, event);

        return this;
    };

    Emit.prototype.allCalls = function (eCount) {
        checkCountOfNumber(eCount);
        checkInstance(this.ee);

        let count = this.ee.__getCallNumberAllEvents__();

        checkCount(eCount, count);

        return this;
    };


    function oneOf () {
        checkInstance(this.ee);

        let eEvents = [...arguments];
        let event = this.ee.__getNextEvent__();

        eEvents.forEach((event) => { checkEventName(event) });

        checkCurrentEvent(event);
        checkOneOf(eEvents, event);

        return this;
    }

    function skip (count) {
        checkCountOfNumber(count);
        checkInstance(this.ee);

        this.ee.__skipEvents__(count);

        let event = this.ee.__getCurrentEvent__();
        checkCurrentEvent(event);

        return this;
    }

    function calls (eCount) {
        checkCountOfNumber(eCount);
        checkInstance(this.ee);

        let count = this.ee.__getEventCallNumber__();

        checkCount(eCount, count);

        return this;
    }

    function last (eEvent) {
        if (eEvent) {
            checkEventName(eEvent);
        }

        checkInstance(this.ee);

        let event = this.ee.__getNextEvent__();
        let isLast = this.ee.__currentIsLast__();

        if (eEvent) {
            checkCurrentEvent(event);
        }

        checkIsLast(isLast, event);

        return this;
    }

    function not (eEvent) {
        checkEventName(eEvent);
        checkInstance(this.ee);

        let event = this.ee.__getNextEvent__();

        checkCurrentEvent(event);
        checkNotEqualEvent(eEvent, event);

        return this;
    }

    function notOneOf () {
        checkInstance(this.ee);

        let eEvents = [...arguments];
        let see = this.ee;
        let event = see.__getNextEvent__();

        eEvents.forEach((event) => { checkEventName(event) });

        checkCurrentEvent(event);
        checkNotOneOf(eEvents, event);

        return this;
    }


    function checkCurrentEvent (event) {
        return new Assertion(event).to.be.a('string', 'all events are checked');
    }

    function checkEventName (eEvent) {
        return new Assertion(eEvent).to.be.a('string', 'Event name to be a String');
    }

    function checkInstance (instance) {
        return new Assertion(instance).to.be.instanceof(EventEmitter, 'expected emitter to be instance of EventEmitter');
    }

    function checkEqualEvent(eEvent, event) {
        return new Assertion(eEvent).to.equal(event, `expected event '${eEvent}' to be a '${event}'`);
    }

    function checkNotEqualEvent(eEvent, event) {
        return new Assertion(eEvent).not.to.equal(event, `expected event '${eEvent}' to be a '${event}'`);
    }

    function checkCount (eCount, count) {
        return new Assertion(eCount).to.equal(count,  `expected event call number '${eCount}' to be a '${count}'`);
    }

    function checkOneOf (eEvents, event) {
        return new Assertion(event).to.be.oneOf(eEvents);
    }

    function checkNotOneOf (eEvents, event) {
        return new Assertion(event).not.to.be.oneOf(eEvents);
    }

    function checkCountOfNumber (count) {
        return new Assertion(count).to.be.a('number', `${count} to be a Number`);
    }

    function checkIsLast (isLast, event) {
        return new Assertion(isLast).to.equal(true, `${event} should be a last`, `${event} shouldn't be a last`);
    }
};