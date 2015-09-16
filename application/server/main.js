var express = require('express');
var ntlm = require('express-ntlm');
var ldap = require('ldapjs');
var config  = require("./config").config;

var app = express();

app.use(
	function crossOrigin(req, res, next) {
		res.header("Access-Control-Allow-Origin", config.cors.origin);
		res.header("Access-Control-Allow-Headers", "Authorization");
		res.header("Access-Control-Allow-Credentials", "true");
		return next();
	}
);

app.use(ntlm({
	debug: function() {
		var args = Array.prototype.slice.apply(arguments);
		console.log.apply(null, args);
	},
	domain: config.ldap.domain,
	domaincontroller: config.ldap.domaincontrollers
}));

app.get('/api/auth', function(req, res) {

	var ldapclient = ldap.createClient({
		url: 'ldap://'+config.ldap.domaincontrollers[0]+'/' + config.ldap.domaindc
	});

	var response = {
		user:  req.ntlm,
		data: {}
	}

	var opts = {
		filter: '(&(cn='+req.ntlm.UserName+')(objectclass=user))',
		scope: 'sub',
		attributes: config.ldap.userattributes
	};

	ldapclient.bind(config.ldap.username, config.ldap.password, function (err) {
		ldapclient.search(config.ldap.usersou, opts, function (err, search) {
			search.on('searchEntry', function (entry) {
				response.data = entry.object;
				res.send('<html><body><script>window.onmessage = function(event) {event.source.postMessage(document.getElementById("payload").innerHTML, event.origin);};</script><div id="payload">' + JSON.stringify(response, null, 2) + '</div></body></html>');
				res.end();
			});
		});
	});

});

var server = app.listen(config.server.port, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('idm listening at http://%s:%s', host, port);
});