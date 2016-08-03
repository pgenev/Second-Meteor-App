Router.configure({
	layoutTemplate: 'main'
});
Router.route('/register');
Router.route('/login');
Router.route('/' , { 
	name: 'home', 
	template: 'home'
});
Router.route('/list/:_id', {
	name: 'listPage',
	template: 'listPage',
	data: function(){
		var currentList = this.params._id;
		return Lists.findOne({_id: currentList});
	}
});

if(Meteor.isClient){
	Template.todos.helpers({
		'todo' : function(){
			var currentList = this._id;
			var createUser = Meteor.userId();
			return Todos.find({listId : currentList, createdBy: createUser}, {sort: {createdAt: -1}});
		}
	});

	Template.addTodo.events({
		'submit form': function(event){
			event.preventDefault();
			var todoName = $('[name="todoName"]').val();
			var currentList = this._id;
			var createUser = Meteor.userId();
			Todos.insert({
				name: todoName,
				completed: false,
				createdAt: new Date(),
				listId: currentList,
				createdBy: createUser
			});
			$('[name="todoName"]').val('');
		}
	});

	Template.todoItem.helpers({
		'checked': function(){
			var isCompleted = this.completed;
			if(isCompleted){
				return "checked";
			} else {
				return "";
			}
		}
	});

	Template.todosCount.helpers({
		'totalTodos' : function() {
			var currentList = this._id;
			return Todos.find({listId: currentList}).count();
		},
		'completedTodos' : function() {
			var currentList = this._id;
			return Todos.find({listId: currentList, completed: true}).count();
		}
	});

	Template.todoItem.events({
		'click .delete_todo' : function(event){
			event.preventDefault();
			var documentId = this._id;
			var confirm = window.confirm("Delete the task?");
			if(confirm){
				Todos.remove({ _id: documentId});
			}
		},
		'keyup [name=todoItem]': function(event){
			    if(event.which == 13 || event.which == 27){
			    		$(event.target).blur();
			    }
			    else{
			    	var documentId = this._id;
					var todoItem = $(event.target).val();
					Todos.update({ _id: documentId}, {$set: {name: todoItem}});
				}

		},
		'change [type=checkbox]' : function(){
			var documentId = this._id;
			var isCompleted = this.completed;
			if(isCompleted){
				Todos.update({ _id: documentId}, {$set: {completed: false}})
				console.log("Task marked as incomplete.");
			} else {
				Todos.update({ _id: documentId}, {$set: {completed: true}})
				console.log("Task marked as completed.");
			}
		}
	});

	Template.addList.events({
		'submit form': function(event){
			event.preventDefault();
			var listName = $('[name=listName]').val();
			var createUser = Meteor.userId();
			Lists.insert({
				name: listName,
				createdBy: createUser
				}, function(error, results) {
					Router.go('listPage', {_id : results});
			});
			$('[name=listName]').val('');
		}
	});
		
	Template.lists.helpers({
		'list' : function(){
			var createUser = Meteor.userId();
			return Lists.find({createdBy: createUser}, {sort: {name: 1}});
		}
	});

	Template.register.events({
		'submit form': function(){
			event.preventDefault();
			var email = $('[name=email]').val();
			var password = $('[name=password]').val();
			Accounts.createUser({
				email: email,
				password: password
			}, function(error){
				if(error){
					console.log(error.reason);
				} else 
				{
					Router.go('home');
				}
			});
			Router.go('home');
		}
	});

	Template.navigation.events({
		'click .logout': function(event){	
			event.preventDefault();
			Meteor.logout();
			Router.go('login');
		}
	});

	Template.login.events({
		'submit form' : function(event){
			event.preventDefault();
			var email = $('[name=email]').val();
			var password = $('[name=password]').val();
			Meteor.loginWithPassword(email, password, function(error){
				if(error){
					console.log(error.reason);
				} else 
				{
					Router.go('home');
				}
			});
		}
	});
}

