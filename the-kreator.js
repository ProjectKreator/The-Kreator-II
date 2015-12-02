Theodoer = new Mongo.Collection("theodoer");

if (Meteor.isClient) {
	

		
	// Code modifier accounts.ui.config

	
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
		
	}); 

	
	
	// Code pour la liste de Theodoer

	Template.index.helpers({

		theodoers: function () {
			// Show newest Theodoer at the top
			return Theodoer.find({}, {sort: {createdAt: -1}});
		}
	});
  
	Template.createForm.events({

		// handle the form submission 
		'submit form': function(event) {

			// stop the form from submitting
			event.preventDefault();

			// get the data we need from the form
			var firstname = event.target.prenom.value;
			var name = event.target.nom.value;
			var email = event.target.email.value;
			var githubaccount = event.target.comptegithub.value;
			// create the new Theodoer
			if(firstname != "" && name != "" && email != ""){
				Meteor.call("createTheodoer", firstname, name, email, githubaccount);
			}
			
			
		}
	}); 
	
	
	
	Template.UpdateForm.events({

		// handle the form submission 
		'submit form': function(event) {

			// stop the form from submitting
			event.preventDefault();

			// get the data we need from the form
			var firstname = event.target.prenom.value;
			var name = event.target.nom.value;
			var email = event.target.email.value;
			var githubaccount = event.target.comptegithub.value;
			// create the new Theodoer
			if(firstname != "" && name != "" && email != ""){
				Meteor.call("createTheodoer", firstname, name, email, githubaccount);
			}
			
			// permet de rerouter vers la page index sans utiliser la fonction href de HTML5
			Router.go('/index');
		}
	}); 
	
/*	
	Template.theodoerPage.events({
	
	});
	
*/	

}   

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
		return Meteor.methods({

			// To be removed when in production!!!
			removeAllTheodoer: function() {
					//Erreur si un utilisateur non identifié veut vider la base
					
					if (! Meteor.userId()) {
						throw new Meteor.Error("not-authorized");
					}
					
				return Theodoer.remove({});
			}

		});
	});
	
	//Prevent new accounts creation
    Accounts.validateNewUser(function() {
		return false;
	});
	
}


Meteor.methods({
	createTheodoer: function (firstname, name, email, githubaccount) {
		// Make sure the user is logged in before creating a theodoer
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		
		Theodoer.insert({
			prenom: firstname,
			nom: name,
			email: email,
			comptegithub: githubaccount,
			createdAt: new Date()
		});
	},
});

/*
La fonction router.map qui fait office de table de root pour tout le site 
commande pour un root individuel :
Router.route('/Formulaire', function () {
  this.render('Formulaire');
});
*/


Router.map(function() {
  this.route('Main', {path: '/'});
  this.route('index');
  this.route('Formulaire');
});

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('Main');
  } else {
    this.next();
  }
};

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    Router.go('index');
  } else {
    this.next();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['Main']});
Router.onBeforeAction(goToDashboard, {only: ['Main']});

// http://meteortips.com/second-meteor-tutorial/iron-router-part-2/ to understand the dynamic route
Router.route('/Theodoer/:_id', {
	template: 'theodoerPage',
	data: function() {
		// grabs the unique ID of the Theodoer in the page's URL
		var currentTheodoer = this.params._id;
		// finds data linked to this Theodoer in the collection
		return Theodoer.findOne({ _id: currentTheodoer });
	}
});