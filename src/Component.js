define([
    '../../Observer/lib/Observer'
], function (Observer) {
    Observer = Observer.constructor
    var invokeList = Observer.invokeList
    var collect = Observer.collect

    function Component (proc) {
        if (!(this instanceof Component)) return new Component(proc)
        Observer.call(this)
        var self = this
        return Proxy.createFunction(
            new ProxyHandler(self, {
                set: function (proxy, name, fn) {
                    switch (name) {
                        case 'on':
                        case 'then':
                            self.on(fn)
                            break
                        default:
                            self.on(name, fn)
                    }
                    return self
                },
                // get: function (proxy, name) {
                //     return function (fn) {
                //         switch (name) {
                //             case 'on':
                //             case 'then':
                //                 self.on(fn)
                //                 break
                //             default:
                //                 self.on(name, fn)
                //         }
                //         return proxy
                //     }
                // }
            }), 
            function () {
                var result = proc.apply(this, arguments)
                if ( result && result instanceof Result ) {
                    invokeList(collect(self, result.type), result = result.value)
                } else {
                    self.publish(result)
                }
                return result
            }
        )
    }
    Component.Result = Result
    function Result (value, type) {
        this.value = value
        this.type = type ? type.split(/\./) : []
    }

    Component.prototype = Object.create(Observer.prototype, {constructor:{value:Component}})
    Component.prototype.call = Function.prototype.call
    Component.prototype.apply = Function.prototype.apply

    Component.new = function (proc) {
        return new(this)(proc)
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
        var result = []
        for (var name in obj) {
            result.push(name)
        }
        return result
    },
    this.keys = function () {
        return Object.keys(obj)
    }
}
