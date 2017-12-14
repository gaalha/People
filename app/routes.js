var index = require('./controllers/index');
var personController = require('./controllers/api/personController');

module.exports = function(app){
	app.use('/',					index);
	app.use('/api/person',			personController);
}