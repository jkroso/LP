define(['Observer'], function (Observer) {
    Observer = Observer.constructor

    function Component (proc) {
        var self = new Observer

        return Proxy.createFunction(
            new ProxyHandler(self, {
                set: function (proxy, name, fn) {
                    if ( name === 'then' || name === 'on' ) {
                        self.on(fn)
                    }
                    return self.on(name, fn)
                }
            }), 
            function () {
                var result = proc.apply(this, arguments)
                if ( result.length === 2 ) {
                    self.publish(result[0], result[1])
                    return result[1]
                }
                self.publish(result)
                return result
            }
        )
    }

    return Component
})

function ProxyHandler (obj, options) {
    options || (options = {})
    this.getOwnPropertyDescriptor = function(name) {
        var desc = Object.getOwnPropertyDescriptor(obj, name);
        // a trapping proxy's properties must always be configurable
        if (desc !== undefined) { desc.configurable = true; }
        return desc;
    },  
    this.getPropertyDescriptor =  function(name) {
        var desc = Object.getPropertyDescriptor(obj, name); // not in ES5
        // a trapping proxy's properties must always be configurable
        if (desc !== undefined) { desc.configurable = true; }
        return desc;
    },
    this.getOwnPropertyNames = function() {
        return Object.getOwnPropertyNames(obj);
    },
    this.getPropertyNames = function() {
        return Object.getPropertyNames(obj); // not in ES5
    },
    this.defineProperty = function(name, desc) {
        Object.defineProperty(obj, name, desc);
    },
    this.delete = options.delete || function (name) {
        return delete obj[name]
    },
    this.fix = function() {
        if (Object.isFrozen(obj)) {
            var result = {};
            Object.getOwnPropertyNames(obj).forEach(function(name) {
                result[name] = Object.getOwnPropertyDescriptor(obj, name);
            });
            return result;
        }
        // As long as obj is not frozen, the proxy won't allow itself to be fixed
        return undefined; // will cause a TypeError to be thrown
    },
    this.has = options.has || function(name) { 
        return name in obj
    }
    this.hasOwn = options.hasOwn || function(name) { 
        return Object.prototype.hasOwnProperty.call(obj, name)
    },
    this.get = options.get || function (receiver, name) {
        return obj[name]
    },
    this.set = options.set || function (receiver, name, val) {
        return obj[name] = val
        // return true
    },  // bad behavior when set fails in non-strict mode
    this.enumerate = function() {
        var result = [];
        for (var name in obj) {
            result.push(name)
        }
        return result
    },
    this.keys = function () {
        return Object.keys(obj)
    }
}
