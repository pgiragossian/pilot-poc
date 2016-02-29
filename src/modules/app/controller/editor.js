
function appControllerEditor() {


	this.content = '';

	this.pmOptions = {
		format: 'json',
		tooltipMenu: true,
		menuBar: {float: true}
	};

	this.restore = function() {
		this.content = JSON.parse(localStorage.getItem('content'));
	};

	this.save = function() {
		localStorage.setItem('content', JSON.stringify(this.content));
		console.log(this.content);
	};

	this.restore();

}

appControllerEditor.$inject = [];

export default appControllerEditor;