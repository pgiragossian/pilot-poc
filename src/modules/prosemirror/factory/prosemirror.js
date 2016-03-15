import {Pos} from 'prosemirror/dist/model';

function prosemirrorFactoryProsemirror($interval, $rootScope) {

	this.pm = null;

	this.init = function() {
		this.model = {
			content: null,
			annotations: []
		};

		this.selectedAnnotations = [];
		this.savedModels = {};

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
		if (this.model.annotations && this.model.annotations.length ) {
			this.model.annotations.forEach(annotation => {
				if (annotation.range &&
						annotation.range.from &&
						(annotation.range.from.cmp(pos) < 0) &&
						annotation.range.to &&
						(annotation.range.to.cmp(pos) > 0)) {
					result.push(annotation);
				}
			});
		}
		console.log('FindAnnotationAt', pos, result);
		return result;
	};
	
	this.addAnnotation = function(from, to, texts, id) {
		console.log('adding', from, to, texts, id);
		let range = this.pm.markRange(from, to, {'className': 'annotation', id});
		this.pm.flush();

		let annotation = {texts, id, range};
		this.model.annotations.push(annotation);
		return annotation;
	};

	this.removeAnnotations = function() {
		this.model.annotations.forEach(ann => {
			this.pm.removeRange(ann.range);
		});
		this.model.annotations.length = 0;
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
	};

	this.restore = function(version) {
		// autosave
		let restored;
		this.selectedAnnotations.length = 0;

		if (version == null) {
			let item = localStorage.getItem('autosave');
			if (item) {
				restored = JSON.parse(item);
			}
		}
		else if (this.savedModels[version]) {
			if (this.savedModels[version]) {
				restored = JSON.parse(this.savedModels[version]);
			}
		}
		this.removeAnnotations();

		if (restored) {
			this.model.content = restored.content;

			this.pm.setContent(this.model.content, this.options.format);
			this.pm.flush();

			if (restored.annotations) {
				restored.annotations.forEach(ann => {
					if (ann.range && ann.range.from && ann.range.to) {
						let from = new Pos(ann.range.from.path, ann.range.from.offset);
						let to = new Pos(ann.range.to.path, ann.range.to.offset);
						this.addAnnotation(from, to, ann.texts, ann.id);
					}
				});
			}
		}


	};

	this.init();

	return this;
}

prosemirrorFactoryProsemirror.$inject = ['$interval', '$rootScope'];

export default prosemirrorFactoryProsemirror;