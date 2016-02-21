"use strict";

let EventEmitter = require('events');

const eventStack    = Symbol("eventStack");
const events        = Symbol("events");
const current       = Symbol("current");

class EE extends EventEmitter {
    constructor () {
        super(...arguments);

        this[eventStack] = [];
        this[events] = {};
        this[current] = 0;
    }

    __addEventToStack__ (eventName) {
        let event = this[events][eventName];

        if (!event) {
            event = {
                count: 0
            };

            this[events][eventName] = event;
        }

        this[eventStack].push(eventName);

        event.count += 1;
    }

    __getCurrentEvent__ () {
        return this[eventStack][this[current]];
    }

    __getNextEvent__ () {
        this[current] += 1;

        return this.__getCurrentEvent__();
    }

    __getCountCallsEvent__ () {
        console.log(this[eventStack][this[current]]);
        return this[events][this[eventStack][this[current]]].count;
    }

    __getCountCallsEvents__ () {
        return this[eventStack].length;
    }

    __skipEvents__ (count) {
        this[current] += (count + 1);
    }

    __currentIsLast__ () {
        return this[eventStack].length - 1 === this[current];
    }

    emit () {
        if (arguments.length === 0) { return }

        super.emit(...arguments);

        this.__addEventToStack__(arguments[0])
    }

}

module.exports = EE;