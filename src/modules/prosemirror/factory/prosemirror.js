import {Pos} from 'prosemirror/dist/model';

function prosemirrorFactoryProsemirror($interval, $rootScope, $window) {

	this.pm = null;

	this.init = function() {
		this.model = {
			content: null,
			annotations: {}
		};

		this.selectedAnnotations = [];
		this.savedModels = {};
		this.currentComment = '';
		this.editedComment = null;
		this.annotationCommentsStyle = {top: '0px'};

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

	this.cancelEditComment = function() {
		this.editedComment = null;
		this.currentComment = '';
	};

	this.editComment = function(annotationId, commentIndex) {
		if (this.model.annotations[annotationId] &&
				this.model.annotations[annotationId].comments[commentIndex]
				) {
			this.editedComment = this.model.annotations[annotationId].comments[commentIndex];
			this.currentComment = this.editedComment.toString();
		}
	};

	this.createAnnotation = function() {
		let id = this.getRandomId();
		let sel = this.pm.selection;
		let annotation = this.addAnnotation(sel.from, sel.to, [], id, false);
		this.selectAnnotations(sel.from, [annotation]);
		$rootScope.$apply();
	};

	this.removeAnnotationComment = function(annotationId, commentIndex) {
		if (this.model.annotations[annotationId] &&
				this.model.annotations[annotationId].comments[commentIndex]) {
			this.model.annotations[annotationId].comments.splice(commentIndex, 1);
		}
	};

	this.getRandomId = function() {
		return Math.floor(Math.random() * 0xffffffff)
	};

	this.removeSavedContent = function() {
		this.savedModels = [];
		localStorage.setItem('savedmodels', []);
		localStorage.setItem('autosave', []);
	};

	this.selectAnnotations = function(pos, forceAnnotations = []) {
		if (angular.isArray(forceAnnotations) && forceAnnotations.length > 0) {
			this.selectedAnnotations = forceAnnotations;
		}
		else {
			this.selectedAnnotations = this.findAnnotationsAt(pos);
		}
		this.annotationCommentsStyle = {top: ($window.scrollY + this.pm.coordsAtPos(pos).top) + 'px'};
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
	
	this.addAnnotation = function(from, to, comments, id, resolved) {
		let range = this.pm.markRange(from, to, {'className': 'annotation', id});
		let annotation = {comments, id, range, resolved};
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

	this.removeAnnotation = function(id, deleteFromModel = true) {

		if (this.model.annotations[id]) {

			let annotation = this.model.annotations[id];
			this.pm.removeRange(annotation.range);
			if (deleteFromModel) {
				delete this.model.annotations[id];
			}
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

	this.addOrEditAnnotationComment = function(annotationId, comment) {

		if (! comment.length) {
			return;
		}
		if (this.selectedAnnotations.length > 0) {
			for(let i = 0; i < this.selectedAnnotations.length; i++) {
				let selAnn = this.selectedAnnotations[i];
				selAnn.comments = selAnn.comments || [];
				if (selAnn.id == annotationId) {
					if (this.editedComment) {
						for (let j = 0; j < selAnn.comments.length; j++) {
							let currComment = selAnn.comments[j];
							if (this.editedComment === currComment) {
								this.selectedAnnotations[i].comments[j] = comment.toString();
							}
						}
					}
					else {
						selAnn.comments.push(comment);
					}
					break;
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
							_this.addAnnotation(Pos.fromJSON(ann.range.from), Pos.fromJSON(ann.range.to), ann.comments, ann.id, ann.resolved);
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

prosemirrorFactoryProsemirror.$inject = ['$interval', '$rootScope', '$window'];

export default prosemirrorFactoryProsemirror;