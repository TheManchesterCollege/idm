exports.config = {
	server: {
		port: 3000
	},
	cors: {
		origin: 'http://example.com'
	},
	ldap : {
		domain: 'example.com',
		domaindc: 'dc=example,dc=com',
		domaincontrollers: [
			'ldap://10.0.0.10',
			'ldap://10.0.0.20',
			'ldap://10.0.0.30',		
			'ldap://10.0.0.40'
		],
		userattributes: ['cn', 'givenName', 'sn'],
		username: 'ldapuser',
		password: 'ldappass',
		usersou: 'ou=EXAMPLEUSERS,dc=tmc,dc=local'
	}	
}