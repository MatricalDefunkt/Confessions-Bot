const wait = require('util').promisify(setTimeout);

module.exports.wait = function (time) {
    wait(time);
}