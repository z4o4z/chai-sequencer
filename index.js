"use strict";

let EventEmitter = require('events');

require('./events.js');

let stack = Symbol("stack");
let current = Symbol("current");
let assertion = Symbol("Assertion");

function Emit (Assertion, ee, eEvent) {
    this.ee = ee;
    this[stack] = ee.__getEventsStack__();
    this[current] = 0;
    this[assertion] = Assertion;

    checkEventName.call(this, eEvent);
    checkInstance.call(this, this.ee);

    let event = this[stack][this[current]];

    checkEventsStack.call(this, this[current], this[stack].length);
    checkEqualEvent.call(this, eEvent, event);

    this.next.oneOf     = oneOf.bind(this);
    this.next.skip      = skip.bind(this);
    this.next.not       = not.bind(this);
    this.next.notOneOf  = notOneOf.bind(this);

    this.is.calls       = calls.bind(this);
}

Emit.prototype.next = function (eEvent) {
    checkEventName.call(this, eEvent);
    checkInstance.call(this, this.ee);

    this[current] += 1;
    
    let event = this[stack][this[current]];

    checkEventsStack.call(this, this[current], this[stack].length);
    checkEqualEvent.call(this, eEvent, event);

    return this;
};

Emit.prototype.last =  function (eEvent) {
    if (eEvent) {
        checkEventName.call(this, eEvent);
    }

    this[current] += 1;

    checkInstance.call(this, this.ee);

    let event = this[stack][this[current]];
    let isLast = this[current] === this[stack].length - 1;

    if (eEvent) {
        checkEventsStack.call(this, this[current], this[stack].length);
    }

    checkIsLast.call(this, isLast, event);

    return this;
}

Emit.prototype.is = function (eEvent) {
    checkEventName.call(this, eEvent);
    checkInstance.call(this, this.ee);

    let event = this[stack][this[current]];

    checkEventsStack.call(this, this[current], this[stack].length);
    checkEqualEvent.call(this, eEvent, event);

    return this;
};

function oneOf () {
    checkInstance.call(this, this.ee);

    this[current] += 1;
    
    let eEvents = [...arguments];
    let event = this[stack][this[current]];

    eEvents.forEach((event) => { checkEventName.call(this, event) });

    checkEventsStack.call(this, this[current], this[stack].length);
    checkOneOf.call(this, eEvents, event);

    return this;
}

function skip (count) {
    checkInstance.call(this, this.ee);

    if (typeof count !== "string" && typeof count !== "number") {
        throw new Error('Argument should be a String or a Number');
    }

    this[current] += (count + 1);

    if (typeof count === "string") {
        while (this[stack][this[current]] !== count || this[current] !== this[stack].length ) {
            this[current] += count;
        }
    }

    checkEventsStack.call(this, this[current], this[stack].length);

    return this;
}

function calls (eCount) {
    checkCountOfNumber.call(this, eCount);
    checkInstance.call(this, this.ee);

    let count = this.ee.__getEventCallNumber__(this[stack][this[current]]);

    checkCount.call(this, eCount, count);

    return this;
}

function not (eEvent) {
    checkEventName.call(this, eEvent);
    checkInstance.call(this, this.ee);

    this[current] += 1;

    let event = this[stack][this[current]];

    checkEventsStack.call(this, event, this[stack].length);
    checkNotEqualEvent.call(this, eEvent, event);

    return this;
}

function notOneOf () {
    checkInstance.call(this, this.ee);

    this[current] += 1;

    let eEvents = [...arguments];
    let event = this[stack][this[current]];

    eEvents.forEach((event) => { checkEventName.call(this, event) });

    checkEventsStack.call(this, event, this[stack].length);
    checkNotOneOf.call(this, eEvents, event);

    return this;
}


function checkEventsStack (currentIndex, length ) {
    return new this[assertion](currentIndex).to.be.below(length, 'all events are checked');
}

function checkEventName (eEvent) {
    return new this[assertion](eEvent).to.be.a('string', 'Event name to be a String');
}

function checkInstance (instance) {
    return new this[assertion](instance).to.be.instanceof(EventEmitter, 'expected emitter to be instance of EventEmitter');
}

function checkEqualEvent(eEvent, event) {
    return new this[assertion](eEvent).to.equal(event, `expected event '${eEvent}' to be a '${event}'`);
}

function checkNotEqualEvent(eEvent, event) {
    return new this[assertion](eEvent).not.to.equal(event, `expected event '${eEvent}' to be a '${event}'`);
}

function checkCount (eCount, count) {
    return new this[assertion](eCount).to.equal(count,  `expected event call number '${eCount}' to be a '${count}'`);
}

function checkOneOf (eEvents, event) {
    return new this[assertion](event).to.be.oneOf(eEvents);
}

function checkNotOneOf (eEvents, event) {
    return new this[assertion](event).not.to.be.oneOf(eEvents);
}

function checkCountOfNumber (count) {
    return new this[assertion](count).to.be.a('number', `${count} to be a Number`);
}

function checkIsLast (isLast, event) {
    return new this[assertion](isLast).to.equal(true, `${event} should be a last`, `${event} shouldn't be a last`);
}

module.exports = function sequencer (chai, utils) {
    let Assertion = chai.Assertion;

    // check the first event
    Assertion.addMethod('emit', emit);

    function emit (eEvent) {
        return new Emit(Assertion, this._obj, eEvent);
    }
};