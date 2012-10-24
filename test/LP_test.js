/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
        expect(numAssertions)
        stop(increment)
        start(decrement)
    Test assertions:
        ok(value, [message])
        equal(actual, expected, [message])
        notEqual(actual, expected, [message])
        deepEqual(actual, expected, [message])
        notDeepEqual(actual, expected, [message])
        strictEqual(actual, expected, [message])
        notStrictEqual(actual, expected, [message])
        raises(block, [expected], [message])
*/
require(['../src/Component', 'Observer'], function (Component, Observer) {
    Observer = Observer.constructor

    window.Component = Component

    test('Can instantiate without error', function () {
        expect(1)
        var a
        try {
            Component(function(data){
                if (data) {
                    return ['true', data]
                }
                return ['false', data]
            })
        } catch (e) {
            ok(false, 'As plain function call')
        }
        try {
            a = new Component(function(data){
                if (data) {
                    return ['true', data]
                }
                return ['false', data]
            })
        } catch (e) {
            ok(false, 'As constructor call')
        }
        strictEqual(a(4), 4, 'This particular component should return any data its called with')
    })

    test('Can set a pin subscription', function () {
        expect(2)
        var is = new Component(function(data){
            if (data) {
                return ['true', data]
            }
            return ['false', data]
        })
        is.true = function (d) {
            console.log(d)
            ok(true, 'Subscription was called')
        }
        ok(is['true'] instanceof Observer, 'New pins should be instances of Observer')
        is(true)
        is(false)
    })

    test('Can disconnect a pin or one of its subscriptions', function () {
        expect(3)
        var is = new Component(function(data){
            return [Boolean(data).toString(), data]
        })
        var sub = is.true = function (d) {
            console.log(d)
            ok(true, 'Subscription was called')
        }
        is.true = function (d) {
            console.log(d)
            ok(true, 'Subscription was called')
        }
        is(true)
        is['true'].off(sub)
        is(true)
    })   
})