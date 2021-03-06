var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var express      = require('express');
var mongoose     = require('mongoose');
var passport     = require('passport');
var path         = require('path');
var session      = require('express-session');

var game = {};

game.app  = express();
game.http = require('http').Server(game.app);
game.io   = require('socket.io')(game.http);
game.aux  = require('./modules/aux');

var main_routes    = require('./routes/main')(game);
var game_routes    = require('./routes/game_routes')(game);
var twitter_routes = require('./routes/twitter_routes')(game);

var user = {};

game.app.use(session({ secret: 'SECRET' }));
game.app.use(passport.initialize());
game.app.use(passport.session());

game.app.use('/',main_routes);
game.app.use('/',game_routes);
game.app.use('/',twitter_routes);

var mongoUrl = '';
var authTwitterCallback = '';


game.app.get('/tst',function(req,res){
	res.render('game');
});

// Set local to use local urls and nothing for remote

var environment = game.aux.trigger;
mongoUrl = environment.mongo;

mongoose.connect(mongoUrl,function(error){
	if(error)
	console.log(error);
});

game.app.get('/dbtest',function(req,res, next){
	mongoose.connect(mongoUrl,function(error){
		if(error)
		console.log(error);
	});
	var roo = mongoose.model('roo',{name: String});
	var rou = new roo({name:'asdunodostres'});
	roo.find({name:'asdunodostres'},function(err,rous){
		if (err) return console.log(err);
		console.log(rous);
		res.send(rous);
	});
});

game.app.use(express.static(__dirname + '/public'));

game.app.set('views', path.join(__dirname, 'views'));
game.app.set('view engine', 'jade');

game.app.use(bodyParser.json());
game.app.use(bodyParser.urlencoded());
game.app.use(cookieParser());

/*var testSchema = new mongoose.Schema({id: String, players: Array});

var roo = mongoose.model('roo',testSchema);*/

game.http.listen(process.env.PORT || 5000);
