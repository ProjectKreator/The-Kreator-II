Template.trelloAuthentication.events({
	'click [name=buttonTrelloAuthentication]' : function(event){
		event.preventDefault();
		var authenticationSuccess = function() { console.log("Successful authentication"); };
		var authenticationFailure = function() { console.log("Failed authentication"); };
	
		Trello.authorize({
		  type: "popup",
		  name: "Getting Started Application",
		  scope: {
		    read: true,
		    write: true },
		  expiration: "1hour",
		  authenticationSuccess,
		  authenticationFailure
		});

		if(Trello.token() != undefined){
			Theodoer.update({_id : Session.get("currentTheodoer")}, {$set:{"requestTrello.token" : true}});
		}
	}

});



Template.trelloInformations.events({
	'click [name=trelloRequest]' : function(event){
		event.preventDefault();
		var token = Trello.token();
		var email = Theodoer.findOne({current:true}).email;
		var prenom = Theodoer.findOne({current:true}).prenom;
		var nom = Theodoer.findOne({current:true}).nom;
		var organisation = Meteor.settings.trello.organization;
		Meteor.call("addUserToOrganizationTrello", token, email, prenom, nom, organisation);
	}
});

Template.trello.helpers({
	'authenticated' : function(){
		try{
			return (Theodoer.findOne({_id : Session.get("currentTheodoer")}).requestTrello.token);
		} catch(e){
			return false;
		}
	},
	requestTrelloStatus:function(){
		try{
			var requestRecipient = Theodoer.findOne({_id : Session.get("currentTheodoer")}).requestTrello.recipient;
			if(requestRecipient == $('[name=email]').val()){
				if(Theodoer.findOne({_id : Session.get("currentTheodoer")}).requestTrello.sent){
					var res = "Invitation envoyée à " + requestRecipient;
					return res;
				} else {
					return "Erreur. Invitation non envoyée.";
				}
			}
			return "";
		} catch (error) {
			return "";
		}
	}
});