
function prosemirrorFactoryProsemirror($interval) {

	this.init = function() {
		this.model = {
			content: null,
			saved: {}
		};

		this.options = {
			format: 'json',
			tooltipMenu: true,
			menuBar: {float: true}
		};

		this.autosaveInterval = 10;
		this.lastAutosaveDate = null;

	};

	this.init();

	var autosave = () => {
		localStorage.setItem('content', JSON.stringify(this.model.content));
		this.lastAutosaveDate = new Date();
	}

	this.autosave = function() {
		$interval(() => autosave(), (this.autosaveInterval * 1000));
	};

	this.getLastSaved = function() {
		let savedKeys = Object.keys(this.model.saved);
		if (!savedKeys.length) {
			return undefined;
		}
		let lastKey = savedKeys[savedKeys.length - 1];
		return (lastKey ? this.model.saved[lastKey] : undefined);
	};

	this.isSaveEnabled = function() {
		let lastSavedObj = this.getLastSaved();
		return (!lastSavedObj) || (JSON.stringify(this.model.content) !== lastSavedObj);
	};

	this.save = function() {
		this.model.saved[new Date().toISOString().slice(0,19)] = JSON.stringify(this.model.content);
	};

	this.restore = function(version) {
		// autosave
		if (version == null) {
			this.model.content = JSON.parse(localStorage.getItem('content'));
		}
		else if (this.model.saved[version]) {
			let restored = JSON.parse(this.model.saved[version]);
			if (restored) {
				this.model.content = restored;
			}
		}
	};

	return this;

}

prosemirrorFactoryProsemirror.$inject = ['$interval'];

export default prosemirrorFactoryProsemirror;