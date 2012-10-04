define(function () {

    function EP (val) {
        Object.defineProperties(this, {
            value: {
                value: value || null,
                writable: true
            },
            listeners: {
                value: [],
                writable: true
            }
        })
    }

    EP.prototype.set = function (newVal) {
        var listeners = this.listeners,
            i = listeners.length
        this.value = newVal
        if ( i ) {
            do {
                listeners[--i](newVal)
            } while ( i )
        }
    }
    
    EP.prototype.get = function () {
        return this.value
    }

    EP.prototype.when = function (fn) {
        this.listeners = this.listeners.slice().push(fn)
    }

    return EP
})