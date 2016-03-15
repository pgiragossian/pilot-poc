import {Pos} from 'prosemirror/dist/model';

function prosemirrorFactoryProsemirror($interval, $rootScope) {

	this.pm = null;

	this.init = function() {
		this.model = {
			content: null,
			annotations: {}
		};

		this.selectedAnnotations = [];
		this.savedModels = {};
		this.currentComment = '';

		let item = localStorage.getItem('savedmodels');

		if (item) {
			let savedModels = JSON.parse(item);

			if (savedModels) {
				this.savedModels = savedModels;
			}
		}

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

	this.createAnnotation = function(text) {
		let id = this.getRandomId();
		let sel = this.pm.selection;
		let annotation = this.addAnnotation(sel.from, sel.to, [text], id);
		this.selectedAnnotations = [annotation];
	};

	this.getRandomId = function() {
		return Math.floor(Math.random() * 0xffffffff)
	};

	this.removeSavedContent = function() {
		this.savedModels = [];
		localStorage.setItem('savedmodels', []);
		localStorage.setItem('autosave', []);
	};

	this.selectAnnotations = function(pos) {
		this.selectedAnnotations = this.findAnnotationsAt(pos);
	};

	this.findAnnotationsAt = function(pos) {
		let result = [];

		for (let annId in this.model.annotations) {
			let ann = this.model.annotations[annId];
			if (ann.range &&
					ann.range.from &&
					(ann.range.from.cmp(pos) < 0) &&
					ann.range.to &&
					(ann.range.to.cmp(pos) > 0)) {
				result.push(ann);
			}
		}

		return result;
	};
	
	this.addAnnotation = function(from, to, texts, id) {
		let range = this.pm.markRange(from, to, {'className': 'annotation', id});
		this.pm.flush();

		let annotation = {texts, id, range};
		this.model.annotations[id] = annotation;
		return annotation;
	};

	this.removeAnnotations = function() {
		for(let annId in this.model.annotations) {
			let ann = this.model.annotations[annId];
			this.pm.removeRange(ann.range);
		}
		this.model.annotations = {};
	};

	this.removeAnnotation = function(id) {

		if (this.model.annotations[id]) {

			let annotation = this.model.annotations[id];
			this.pm.removeRange(annotation.range);
			delete this.model.annotations[id];
		}
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
	};

	this.addAnnotationComment = function(annotationId, comment) {

		if (this.selectedAnnotations.length > 0) {
			for(let i = 0; i < this.selectedAnnotations.length; i++) {
				let selAnn = this.selectedAnnotations[i];
				if (selAnn.id == annotationId) {
					selAnn.texts.push(comment);
				}
			}
		}
		this.currentComment = '';
	};

	this.restore = function(version) {
		// autosave
		let restoredData;
		this.selectedAnnotations.length = 0;
		this.currentComment = '';

		if (version == null) {
			let item = localStorage.getItem('autosave');
			if (item) {
				restoredData = JSON.parse(item);
			}
		}
		else if (this.savedModels[version]) {
			if (this.savedModels[version]) {
				restoredData = JSON.parse(this.savedModels[version]);
			}
		}
		if (restoredData) {

			var _this = this;

			function restoreAnnotation() {
				if (restoredData.annotations) {
					for (let annId in restoredData.annotations) {
						let ann = restoredData.annotations[annId];
						if (ann.range && ann.range.from && ann.range.to) {
							_this.addAnnotation(Pos.fromJSON(ann.range.from), Pos.fromJSON(ann.range.to), ann.texts, ann.id);
						}
					}
				}
				_this.pm.off('setDoc', restoreAnnotation);
			}

			this.pm.on('setDoc', restoreAnnotation);

			this.removeAnnotations();
			this.model.content = restoredData.content;
		}
	};

	this.init();

	return this;
}

prosemirrorFactoryProsemirror.$inject = ['$interval', '$rootScope'];

export default prosemirrorFactoryProsemirror;