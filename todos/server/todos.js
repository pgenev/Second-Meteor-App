

if(Meteor.isServer){
	Meteor.publish('lists', function(){
		var currentUser = this.userId;
		return Lists.find({createdBy: currentUser});
	});

	Meteor.publish('todos', function(){
		var currentUser = this.userId;
		return Todos.find({createdBy: currentUser})
	});
}
