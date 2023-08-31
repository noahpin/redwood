let textEditorToolbar = [];


function initTextEditor() {
	window.easyMDE = new EasyMDE({
		autofocus: true,
		unorderedListStyle: "-",
		forceSync: true,
		shortcuts: {
			toggleFullScreen: null, // alter the shortcut for toggleOrderedList
		},
		toolbar: false,
		toolbarTips: false,
		tabSize: 4,
		status: false,
		renderingConfig: {
			codeSyntaxHighlighting: true,
		},
	});
	window.cm = window.easyMDE.codemirror;
    
	textEditorToolbar = [
		{
			name: "clear-format",
			action: (e)=>{easyMDE.cleanBlock(e)},
			icon: "ri-format-clear",
			title: "Clear Formatting",
		},
		"|",
		{
			name: "heading",
			action: (e)=>{easyMDE.toggleHeadingSmaller(e)},
			icon: "ri-heading",
			title: "Heading",
		},
		{
			name: "bold",
			icon: "ri-bold",
			title: "Bold",
			action: (e) =>{easyMDE.toggleBold(e)},
		},
		{
			name: "italic",
			action: (e)=>{easyMDE.toggleItalic(e)},
			icon: "ri-italic",
			title: "Italic",
		},
		{
			name: "strikethrough",
			action: (e)=>{easyMDE.toggleStrikethrough(e)},
			icon: "ri-strikethrough",
			title: "Strikethrough",
		},
		"|",
		{
			name: "link",
			action: (e)=>{easyMDE.drawLink(e)},
			icon: "ri-link-m",
			title: "Insert Link",
		},
		{
			name: "quote",
			action: (e)=>{easyMDE.toggleBlockquote(e)},
			icon: "ri-double-quotes-r",
			title: "Insert Quote",
		},
		{
			name: "code",
			action: (e)=>{easyMDE.toggleCodeBlock(e)},
			icon: "ri-braces-line",
			title: "Insert Code Block",
		},
		{
			name: "unordered-list",
			action: (e)=>{easyMDE.toggleUnorderedList(e)},
			icon: "ri-list-unordered",
			title: "Unordered List",
		},
		{
			name: "ordered-list",
			action: (e)=>{easyMDE.toggleOrderedList(e)},
			icon: "ri-list-ordered-2",
			title: "Ordered List",
		},
		{
			name: "table",
			action: (e)=>{easyMDE.drawTable(e)},
			icon: "ri-table-2",
			title: "Table",
		},
        "|",
		{
			name: "increase-indent",
			action: (e)=>{easyMDE.toggleOrderedList(e)},
			icon: "ri-indent-increase",
			title: "Increase Indent",
		},
		{
			name: "Decrease-indent",
			action: (e)=>{easyMDE.toggleOrderedList(e)},
			icon: "ri-indent-decrease",
			title: "Decrease Indent",
		},

	];

	cm.on("cursorActivity", function () {
		var stat = getMDEState(cm);
		console.log(stat);

        textEditorToolbar.forEach((item, index) => {
            if (item === "|") {
                return;
            }
            if (stat[item.name]) {
                item.el.classList.add("active");
            } else {
                item.el.classList.remove("active");
            }
        })
	});


}
function initToolbar() {
    toolbarInner = document.getElementById("text-editor-settings-inner")
	toolbarInner.innerHTML = "";

	textEditorToolbar.forEach((item, index) => {
		if (item === "|") {
			document.getElementById("text-editor-settings-inner").innerHTML +=
				'<div class="divider"></div>';
			return;
		}

		let toolbarButton = document.createElement("button");
		toolbarButton.id = "toolbar-"+item.name;
		toolbarButton.classList.add("setting-button");
		toolbarButton.title = item.title;
        toolbarButton.setAttribute("type",'a');
		toolbarButton.innerHTML = `<i class="${item.icon}"></i>`;
		toolbarInner.appendChild(toolbarButton)
        setTimeout(() => {
            textEditorToolbar[index].el = (document.getElementById("toolbar-"+item.name))
            textEditorToolbar[index].el.addEventListener("click", e=>{e.preventDefault();
                item.action(EasyMDE)});
        }, 1);
	});

	
}

function getMDEState(cm, pos) {
	pos = pos || cm.getCursor("start");
	var stat = cm.getTokenAt(pos);
	if (!stat.type) return {};

	var types = stat.type.split(" ");

	var ret = {},
		data,
		text;
	for (var i = 0; i < types.length; i++) {
		data = types[i];
		if (data === "strong") {
			ret.bold = true;
		} else if (data === "variable-2") {
			text = cm.getLine(pos.line);
			if (/^\s*\d+\.\s/.test(text)) {
				ret["ordered-list"] = true;
			} else {
				ret["unordered-list"] = true;
			}
		} else if (data === "atom") {
			ret.quote = true;
		} else if (data === "em") {
			ret.italic = true;
		} else if (data === "quote") {
			ret.quote = true;
		} else if (data === "strikethrough") {
			ret.strikethrough = true;
		} else if (data === "comment") {
			ret.code = true;
		} else if (data === "link" && !ret.image) {
			ret.link = true;
		} else if (data === "image") {
			ret.image = true;
		} else if (data.match(/^header(-[1-6])?$/)) {
			ret[data.replace("header", "heading")] = true;
		}
	}
	return ret;
}

let previousPreviewState = false;
function togglePreview() {
	window.easyMDE.togglePreview();
	if (previousPreviewState) {
		document
			.getElementById("preview-toggle-icon")
			.classList.add("hi-book-open-mono");
		document
			.getElementById("preview-toggle-icon")
			.classList.remove("hi-pencil-mono");

		document.querySelector(".CodeMirror-scroll").style.display = "block";
		document.querySelector(".CodeMirror").classList.remove("no-padding");

		document.querySelector(".CodeMirror-scroll").style.pointerEvents = "all";
		previousPreviewState = false;
		return;
	}
	setTimeout(() => {
		if (easyMDE.isPreviewActive()) {
			previousPreviewState = true;
			document
				.getElementById("preview-toggle-icon")
				.classList.remove("hi-book-open-mono");
			document
				.getElementById("preview-toggle-icon")
				.classList.add("hi-pencil-mono");
			document.querySelector(".CodeMirror-scroll").style.display = "none";
			document.querySelector(".CodeMirror").classList.add("no-padding");
			document.querySelector(".CodeMirror-scroll").style.pointerEvents = "none";
			document.querySelector(".editor-preview-active").contentEditable =
				"false";
		} else {
		}
	}, 1);
}
