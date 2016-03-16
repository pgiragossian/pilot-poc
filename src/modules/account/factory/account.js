function accountFactoryAccount() {

	this.init = function() {
		this.model = {
			users: [
				{id:1, name: 'Paul Giragossian', avatar: null, initials: 'PG'},
				{id:2, name: 'Matthieu Bellon', avatar: 'https://avatars.slack-edge.com/2016-03-02/23880176528_8c030a6c65bb96176666_48.jpg', initials:"MB"}
			]
		};

		this.model.selectedUser = this.model.users[0];
	}

	this.init();

	return this;

}

accountFactoryAccount.$inject = [];

export default accountFactoryAccount;

