var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
	dui: {type: String, required: 'Please enter a valid DUI number', unique:true},
	name: {type: String, required:'Enter a person name'},
	age: {type: Number, required:'Please enter a valid age', min: 2, max:100},
	address: {type: String, required:'Please enter a valid address'}
});

module.exports = mongoose.model('Person', PersonSchema);

