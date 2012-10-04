## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/jkroso/LP/master/dist/LP.min.js
[max]: https://raw.github.com/jkroso/LP/master/dist/LP.js

## Examples
```javascript
    var is = new Component(function(data){
        if (data) {
            return ['true', data]
        }
        return ['false', data]
    })
    is.true = function (d) {
        console.log('Yup sure is')
    }
    is.false = function (d) {
        console.log('Nope, it most definitly is not')
    }
```
Now to invoke the component you just need to call it like a function. The procedure you passed will then be evaluated with the arguments you give it. If you return a pair of values in an array the first value will determine the output pin while the second value will be the data sent over the pin. If you do not return a pair from your procedure then only general listeners of the component will be invoked. General listeners are added like so:
```javascript
	is.on = function () {
		console.log('On was called')
	}
	is.then = function () {
		console.log("Then was called")
	}
```
"on" and "then" are sinonyms for each other so it doesn't matter which you use. Now if we are to invoke the component we created with something like, `is(1 > 0)`, we would see the following in our console:

	Yup sure is
	On was called
	Then was called

You can see then that general pins are always sent data and thereby invoked while specified pins only when the results from the component allow it. 

## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Jakeb Rosoman  
Licensed under the MIT license.
