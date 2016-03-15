export const annotationCmd = {annotate: {
	label: "Add annotation",
	select(pm) {
			return pm.mod.factory && !pm.selection.empty
	},
	run(pm, text) {
		pm.mod.factory.createAnnotation(text)
	},
	params: [
		{name: "Annotation text", type: "text"}
	],
	menu: {
		group: "inline", rank: 99,
		display: {
			type: "icon",
			width: 1024, height: 1024,
			path: "M512 219q-116 0-218 39t-161 107-59 145q0 64 40 122t115 100l49 28-15 54q-13 52-40 98 86-36 157-97l24-21 32 3q39 4 74 4 116 0 218-39t161-107 59-145-59-145-161-107-218-39zM1024 512q0 99-68 183t-186 133-257 48q-40 0-82-4-113 100-262 138-28 8-65 12h-2q-8 0-15-6t-9-15v-0q-1-2-0-6t1-5 2-5l3-5t4-4 4-5q4-4 17-19t19-21 17-22 18-29 15-33 14-43q-89-50-141-125t-51-160q0-99 68-183t186-133 257-48 257 48 186 133 68 183z"
		}
	}
}}