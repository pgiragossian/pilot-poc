
function prosemirrorFactoryProsemirror($interval) {

	this.init = function() {
		this.model = {
			content: null,
			annotations: {}
		};

		this.currentAnnotationHash = null;
		this.savedModels = {};

		let savedModels = JSON.parse(localStorage.getItem('savedmodels'));

		if (savedModels) {
			this.savedModels = savedModels;
		}

		this.addAnnotation = function(comment) {
			if (this.currentAnnotationHash) {
				if (this.model && this.model.annotations && !this.model.annotations[this.currentAnnotationHash]) {
					this.model.annotations[this.currentAnnotationHash] = [];
				}
				this.model.annotations[this.currentAnnotationHash].push(comment);
			}
		};

		this.options = {
			format: 'json',
			tooltipMenu: true,
			menuBar: {float: true}
		};

		this.autosaveInterval = 10;
		this.lastAutosaveDate = null;

	};

	var autosave = () => {
		localStorage.setItem('autosave', JSON.stringify(this.model));
		this.lastAutosaveDate = new Date();
	};

	this.setCurrentAnnotationHash = hash => {
		this.currentAnnotationHash = hash;
	};

	this.autosave = function() {
		$interval(() => autosave(), (this.autosaveInterval * 1000));
	};

	this.getLastSaved = function() {
		let savedKeys = Object.keys(this.savedModels);
		if (!savedKeys.length) {
			return undefined;
		}
		let lastKey = savedKeys[savedKeys.length - 1];
		return (lastKey ? this.savedModels[lastKey] : undefined);
	};

	this.isSaveEnabled = function() {
		let lastSavedObj = this.getLastSaved();
		return (!lastSavedObj) || (JSON.stringify(this.model) !== lastSavedObj);
	};

	this.save = function() {
		this.savedModels[new Date().toISOString().slice(0,19)] = JSON.stringify(this.model);
		localStorage.setItem('savedmodels', JSON.stringify(this.savedModels));
		console.log(this.model);
	};

	this.getCurrentComments = function() {
		if (this.currentAnnotationHash) {
			return this.model.annotations[this.currentAnnotationHash];
		}
	};

	this.restore = function(version) {
		// autosave
		if (version == null) {
			let restored = JSON.parse(localStorage.getItem('autosave'));
			if (restored) {
				this.model = restored;
			}
		}
		else if (this.savedModels[version]) {
			let restored = JSON.parse(this.savedModels[version]);
			if (restored) {
				this.model = restored;
			}
		}
	};

	this.init();
	this.restore();

	return this;
}

prosemirrorFactoryProsemirror.$inject = ['$interval'];

export default prosemirrorFactoryProsemirror;