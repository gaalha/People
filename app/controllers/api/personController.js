var express = require('express');
var router = express.Router();
var Person = require('../../models/person');

router.post('/savePerson', function(req, res, next){
	var id = req.body.txtIdHidden;
	var dui = req.body.txtDui;
	var name = req.body.txtName;
	var age = req.body.txtAge;
	var address = req.body.txtAddress;


	if(id != 0 ){
		var person = new Person({
			_id: id,
			dui: dui,
			name: name,
			age: age,
			address: address
		});

		Person.findByIdAndUpdate(id, person, function(err){
            if(err){return next(err)};
            res.send({success: true, message: 'Data updated successfuly', data: person});
        });
	}else{
		var person = new Person({
			dui: dui,
			name: name,
			age: age,
			address: address
		});

		person.save(function(err){
			if(err){res.send(err);}
			res.send({success: true, message: 'Data saved successfuly', data: person});
		});
		
	}
});

router.get('/getPersonList', function(req, res, next){
	Person.find({}, 'dui name age address').exec(function(err, personList){
		if(err){res.send(err);}
		res.send({data: personList});
	});
});

router.get('/getPersonData/:id', function(req, res, next){
	var id = req.params.id;
	Person.findById(id).exec(function(err, person){
		if(err){return next(err);}
		res.send({success: true, data: person});
	});
});

router.delete('/deletePerson/:id', function(req, res, next){
	var id = req.params.id;
	Person.findByIdAndRemove(id, function(err){
        if(err){return next(err);}
        res.send({success: true, message: 'Data deleted successfuly'});
    });
});

module.exports = router;