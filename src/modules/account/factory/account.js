export default class accountFactoryAccount {

	static get $inject() {
		return [];
	}

	init() {
		this.model = {
			users: [
				{id:1, name: 'Paul Giragossian', avatar: null},
				{id:2, name: 'Matthieu Bellon', avatar: 'https://avatars.slack-edge.com/2016-03-02/23880176528_8c030a6c65bb96176666_48.jpg'}
			]
		}

		this.model.userSelected = this.model.users[0];
	}

}

