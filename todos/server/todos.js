

if(Meteor.isServer){
	Meteor.publish('lists', function(){
		var currentUser = this.userId;
		return Lists.find({createdBy: currentUser});
	});

	Meteor.publish('todos', function(currentList){
		var currentUser = this.userId;
		return Todos.find({createdBy: currentUser, listId: currentList})
	});

	function defaultName(currentUser){
		var nextLetter = 'A';
		var nextName = 'List' + nextLetter;
		while(Lists.findOne({name: nextName, createdBy: currentUser})){
			nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) +1);
			nextName = 'List ' + nextLetter;
		}
	}

	Meteor.methods({
		'createNewList': function(listName){
			var currentUser = Meteor.userId();
			check(listName, String);
			if(listName == '')
			{
				listName = defaultName(currentUser)
			}
			var data = {
				name: listName,
				createdBy: currentUser
			}
			if(!currentUser){
				throw new Meteor.Error("not logged-in", "You are not logged-in.");
			}
			return Lists.insert(data);
		},
		'createListItem' : function(todoName, currentList){
			var currentUser = Meteor.userId();
			var currentList1 = Lists.findOne(currentList);
			if(currentList1.createdBy != currentUser){
				throw new Meteor.Error("invalid-user", "You don't own that list.");
			}
			check(todoName, String);
			check(currentList, String);
			if(!currentUser){
				throw new Meteor.Error("not logged-in", "You are not logged-in.");
			}
			var data = {
				name: todoName,
				completed: false,
				createdAt: new Date(),
				createdBy: currentUser,
				listId: currentList
			}
			return Todos.insert(data);
		},
		'updateListItem': function(documentId, todoItem){
			check(todoItem, String);
			var currentUser = Meteor.userId();
			if(!currentUser){
				throw new Meteor.Error("not logged-in", "You are not logged-in.");
			}
			var data = {
				_id: documentId,
				createdBy: currentUser
			}
			Todos.update(data, {$set: {name: todoItem}});
		},
		'changeItemStatus': function(documentId, status){
			check(status, Boolean);
			var currentUser = Meteor.userId();
			if(!currentUser){
				throw new Meteor.Error("not logged-in", "You are not logged-in.");
			}
			var data = {
				_id : documentId,
				createdBy: currentUser			
			}
			Todos.update(data, {$set: {completed: status}});
		},
		'removeListItem': function(documentId){
			var currentUser = Meteor.userId();
			if(!currentUser){
				throw new Meteor.Error("not logged-in", "You are not logged-in.");
			}
			var data = {
				_id : documentId
			}
			Todos.remove(data);
		}
	});	
}
