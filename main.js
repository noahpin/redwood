var handTopLayer = document.getElementById("handwritingTop");
var handBottomLayer = document.getElementById("handwritingBottom");
var textEditableArea = document.getElementById("textEditable");
var appContainer = document.getElementById("app-container");
var documentContainer = document.getElementById("document-container");
var textEditableBounds = getOffsetRect(textEditableArea);

document.onkeydown = function (e) {
	textEditableArea.focus();
};

textEditableArea.onfocus = function () {
	document.getElementById("text-editor-settings").classList.add("open");
};
textEditableArea.onblur = function () {
	document.getElementById("text-editor-settings").classList.remove("open");
};

notify = new Alrt({
	position: "top-center",
	duration: 1200, //default duration
	behavior: "overwrite",
});

handTopLayer.setAttributeNS(
	null,
	"viewBox",
	"0 0 " + textEditableBounds.width + " " + textEditableBounds.height
);
handTopLayer.setAttributeNS(null, "width", textEditableBounds.width);
handTopLayer.setAttributeNS(null, "height", textEditableBounds.height);

handBottomLayer.setAttributeNS(
	null,
	"viewBox",
	"0 0 " + textEditableBounds.width + " " + textEditableBounds.height
);
handBottomLayer.setAttributeNS(null, "width", textEditableBounds.width);
handBottomLayer.setAttributeNS(null, "height", textEditableBounds.height);

//replace the above with a resizeobserver
const resizeobserver = new ResizeObserver((entries) => {
	for (let entry of entries) {
		textEditableBounds = getOffsetRect(textEditableArea);

		handTopLayer.setAttributeNS(
			null,
			"viewBox",
			"0 0 " + textEditableBounds.width + " " + textEditableBounds.height
		);
		handTopLayer.setAttributeNS(null, "width", textEditableBounds.width);
		handTopLayer.setAttributeNS(null, "height", textEditableBounds.height);

		handBottomLayer.setAttributeNS(
			null,
			"viewBox",
			"0 0 " + textEditableBounds.width + " " + textEditableBounds.height
		);
		handBottomLayer.setAttributeNS(null, "width", textEditableBounds.width);
		handBottomLayer.setAttributeNS(null, "height", textEditableBounds.height);
	}
});
resizeobserver.observe(textEditableArea);

var EDITOR_COLORS = {
	primary: {
		css: "--editor-draw-primary",
		id: "editor-draw-primary",
		key: "primary",
	},
	secondary: {
		css: "--editor-draw-secondary",
		id: "editor-draw-secondary",
		key: "secondary",
	},
	tertiary: {
		css: "--editor-draw-tertiary",
		id: "editor-draw-tertiary",
		key: "tertiary",
	},
	bark: { css: "--editor-draw-bark", id: "editor-draw-bark", key: "bark" },
	red: { css: "--editor-draw-red", id: "editor-draw-red", key: "red" },
	orange: {
		css: "--editor-draw-orange",
		id: "editor-draw-orange",
		key: "orange",
	},
	yellow: {
		css: "--editor-draw-yellow",
		id: "editor-draw-yellow",
		key: "yellow",
	},
	green: { css: "--editor-draw-green", id: "editor-draw-green", key: "green" },
	cyan: { css: "--editor-draw-cyan", id: "editor-draw-cyan", key: "cyan" },
	blue: { css: "--editor-draw-blue", id: "editor-draw-blue", key: "blue" },
	purple: {
		css: "--editor-draw-purple",
		id: "editor-draw-purple",
		key: "purple",
	},
	pink: { css: "--editor-draw-pink", id: "editor-draw-pink", key: "pink" },
};

const STROKE_STYLES = {
	FINE: "fine",
	DOT: "dot",
	DASH: "dash",
	DRAWN: "drawn",
};

const CURRENT_STROKE_SETTINGS = {
	color: EDITOR_COLORS.primary,
	size: 6,
	style: STROKE_STYLES.FINE,
	mode: "pen",
};

function createColorMenu() {
	document.getElementById("handwriting-settings-color-section").innerHTML = "";
	let i = 0;
	let row;
	for (const [key, value] of Object.entries(EDITOR_COLORS)) {
		if (i % 4 == 0) {
			row = document.createElement("div");
			row.classList.add("handwriting-settings-horizontal");
			document
				.getElementById("handwriting-settings-color-section")
				.appendChild(row);
		}
		i++;

		let colorButton = document.createElement("button");
		colorButton.classList.add("setting-button", "color-button");
		colorButton.style.setProperty("color", "var(" + value.css + ")");
		colorButton.id = value.id;
		colorButton.onclick = function () {
			setDrawColor(value.key);
			console.log("asdf");
		};
		let colorIcon = document.createElement("i");
		colorIcon.classList.add("hi-circle-small-fill-mono");
		colorButton.appendChild(colorIcon);

		row.appendChild(colorButton);
	}
}

createColorMenu();
setDrawColor("primary");
setDrawStyle("FINE");

function setDrawColor(color) {
	console.log("asdf");
	CURRENT_STROKE_SETTINGS.color = EDITOR_COLORS[color];

	document.querySelectorAll(".color-button").forEach((el) => {
		el.classList.remove("active");
	});
	document.querySelectorAll(`#${EDITOR_COLORS[color].id}`).forEach((el) => {
		el.classList.add("active");
	});
	document.getElementById("current-draw-color").style.color =
		"var(" + EDITOR_COLORS[color].css + ")";
}

function setDrawMode(mode) {
	if (mode == "pen") {
		CURRENT_STROKE_SETTINGS.mode = "pen";
		//all ids that start with draw-mode
		document.querySelectorAll("[id^='draw-mode-']").forEach((el) => {
			el.classList.remove("active");
		});
		document.getElementById("draw-mode-pen").classList.add("active");
	} else if (mode == "highlighter") {
		CURRENT_STROKE_SETTINGS.mode = "highlighter";

		document.querySelectorAll("[id^='draw-mode-']").forEach((el) => {
			el.classList.remove("active");
		});
		document.getElementById("draw-mode-highlighter").classList.add("active");
	}
}

function setDrawStyle(style) {

	if(STROKE_STYLES.hasOwnProperty(style)){
		console.log("ya")
	}
	
	document.querySelectorAll("[id^='draw-style-']").forEach((el) => {
		el.classList.remove("active");
	});
	document.getElementById("draw-style-" + STROKE_STYLES[style]).classList.add("active");
	CURRENT_STROKE_SETTINGS.style = STROKE_STYLES[style];
}


function drawPen(path, id) {
	const pts = path.path;
	var options = {
		simulatePressure: false,
		size: path.options.size + path.options.size * 0.6,
	};
	const strokePoints = getStrokePoints(pts, options);
	const outlinePoints = getStrokeOutlinePoints(strokePoints, options); //used for hand-written outline path, pressure sensitive
	const solidStrokePath = getSvgPathFromStrokePoints(strokePoints, false);
	const outlineFillPath = getSvgPathFromStroke(outlinePoints);
	//draw svg on handTopLayer object. both should just be paths with fill:none and stroke:black

	//draw outline path
	let outlinePath = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	outlinePath.id = id;

	if (path.options.style == STROKE_STYLES.DRAWN) {
		outlinePath.setAttributeNS(null, "d", outlineFillPath);
		outlinePath.setAttributeNS(null, "fill", `var(${path.options.color.css})`);
	} else {
		outlinePath.setAttributeNS(null, "d", solidStrokePath);
		outlinePath.setAttributeNS(null, "stroke-width", path.options.size);

		outlinePath.setAttributeNS(null, "fill", `#00000000`); //transparent
		outlinePath.setAttributeNS(null, "stroke-linecap", `round`);
		outlinePath.setAttributeNS(
			null,
			"stroke",
			`var(${path.options.color.css})`
		);

		if (STROKE_STYLES.DASH == path.options.style) {
			outlinePath.setAttributeNS(
				null,
				"stroke-dasharray",
				`${path.options.size * 2} ${path.options.size * 2.5}`
			);
		} else if (STROKE_STYLES.DOT == path.options.style) {
			outlinePath.setAttributeNS(
				null,
				"stroke-dasharray",
				`0.01 ${path.options.size * 2.5}`
			);
		}
	}

	handTopLayer.appendChild(outlinePath);
}

function drawHighlighter(path, id) {
	const pts = path.path;
	var options = {
		simulatePressure: false,
		size: 20 + path.options.size + path.options.size * 0.6,
	};
	const strokePoints = getStrokePoints(pts, options);
	const solidStrokePath = getSvgPathFromStrokePoints(strokePoints, false);

	//draw outline path
	let outlinePath = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	outlinePath.id = id;

	outlinePath.setAttributeNS(null, "d", solidStrokePath);
	outlinePath.setAttributeNS(null, "stroke-width", path.options.size + 20);

	outlinePath.setAttributeNS(null, "fill", `#00000000`); //transparent
	outlinePath.setAttributeNS(null, "stroke-linecap", `round`);
	outlinePath.setAttributeNS(null, "stroke", `var(${path.options.color.css})`);
	outlinePath.setAttributeNS(null, "stroke-opacity", `0.5`);

	handBottomLayer.appendChild(outlinePath);
}

function updatePath(id) {
	if (CURRENT_STROKE_SETTINGS.mode == "pen") {
		if (handTopLayer.getElementById(id)) {
			handTopLayer.getElementById(id).remove();
		}
		drawPen(toplevelPaths[id], id);
	} else if (CURRENT_STROKE_SETTINGS.mode == "highlighter") {
		if (handBottomLayer.getElementById(id)) {
			handBottomLayer.getElementById(id).remove();
		}
		drawHighlighter(bottomlevelPaths[id], id);
	}
}

let toplevelPaths = {};

let bottomlevelPaths = {};

let drawnPath = [];
let activePath = null;

var isPen = false;

document.body.addEventListener(
	"pointerdown",
	function (e) {
		if (!documentContainer.contains(e.target)) return;
		if (e.pointerType === "pen") {
			isPen = true;
			textEditableArea.contentEditable = false;
			e.preventDefault();
		} else {
			isPen = false;
			textEditableArea.contentEditable = true;
		}
	},
	{
		capture: true,
	}
);

colorIndex = 0;

document.body.addEventListener(
	"touchstart",
	function (e) {
		if (!documentContainer.contains(e.target)) return;
		if (isPen) {
			e.preventDefault();
			activePath = genId();
			//pick different color each time, increment by one
			var color = Object.keys(EDITOR_COLORS)[colorIndex];
			colorIndex = (colorIndex + 1) % Object.keys(EDITOR_COLORS).length;
			if(CURRENT_STROKE_SETTINGS.mode == "pen"){
				toplevelPaths[activePath] = {
					path: [
						[
							e.touches[0].clientX - textEditableBounds.left + window.scrollX,
							e.touches[0].clientY -
								textEditableBounds.top +
								appContainer.scrollTop,
							e.touches[0].force,
						],
					],
					options: {
						size: CURRENT_STROKE_SETTINGS.size,
						color: CURRENT_STROKE_SETTINGS.color,
						style: CURRENT_STROKE_SETTINGS.style,
					},
				};

			}else if(CURRENT_STROKE_SETTINGS.mode=="highlighter"){
				bottomlevelPaths[activePath] = {
					path: [
						[
							e.touches[0].clientX - textEditableBounds.left + window.scrollX,
							e.touches[0].clientY -
								textEditableBounds.top +
								appContainer.scrollTop,
							e.touches[0].force,
						],
					],
					options: {
						size: CURRENT_STROKE_SETTINGS.size,
						color: CURRENT_STROKE_SETTINGS.color,
						style: CURRENT_STROKE_SETTINGS.style,
					},
				};
			}
		}
	},
	{
		passive: false,
		capture: false,
	}
);

document.ontouchmove = function (e) {
	if (!documentContainer.contains(e.target)) return;
	e.preventDefault();
	if (activePath) {
		if (
			e.touches[0].clientY - textEditableBounds.top + appContainer.scrollTop >
			textEditableBounds.height - 250
		) {
			textEditableArea.style.minHeight = textEditableBounds.height + 250 + "px";
		}
		if(CURRENT_STROKE_SETTINGS.mode == "pen"){
			toplevelPaths[activePath].path.push([
				e.touches[0].clientX - textEditableBounds.left + window.scrollX,
				e.touches[0].clientY - textEditableBounds.top + appContainer.scrollTop,
				e.touches[0].force,
			]);

		}else if(CURRENT_STROKE_SETTINGS.mode == "highlighter"){
			bottomlevelPaths[activePath].path.push([
				e.touches[0].clientX - textEditableBounds.left + window.scrollX,
				e.touches[0].clientY - textEditableBounds.top + appContainer.scrollTop,
				e.touches[0].force,
			]);
		}
		updatePath(activePath);
	}
};

document.ontouchend = function (e) {
	if (!documentContainer.contains(e.target)) return;
	e.preventDefault();
	if (activePath) {
		updatePath(activePath);

		activePath = null;
	}
};

function genId() {
	return Math.random().toString(36).substring(2, 15);
}

function average(a, b) {
	return (a + b) / 2;
}

function getSvgPathFromStroke(points, closed = true) {
	const len = points.length;

	if (len < 4) {
		return ``;
	}

	let a = points[0];
	let b = points[1];
	const c = points[2];

	let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
		2
	)},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
		b[1],
		c[1]
	).toFixed(2)} T`;

	for (let i = 2, max = len - 1; i < max; i++) {
		a = points[i];
		b = points[i + 1];
		result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
			2
		)} `;
	}

	if (closed) {
		result += "Z";
	}

	return result;
}

function getOffsetRect(el) {
	let rect = el.getBoundingClientRect();

	// add window scroll position to get the offset position
	let left = rect.left + window.scrollX;
	let top = rect.top + appContainer.scrollTop;
	let right = rect.right + window.scrollX;
	let bottom = rect.bottom + appContainer.scrollTop;

	// polyfill missing 'x' and 'y' rect properties not returned
	// from getBoundingClientRect() by older browsers
	let x = rect.x === undefined ? left : rect.x + window.scrollX;
	let y = rect.y === undefined ? top : rect.y + appContainer.scrollTop;

	// width and height are the same
	let width = rect.width;
	let height = rect.height;

	return { left, top, right, bottom, x, y, width, height };
}

function precise(A) {
	return `${A[0]},${A[1]} `;
}

function averageVect(A, B) {
	return `${(A[0] + B[0]) / 2},${(A[1] + B[1]) / 2} `;
}

/**
 * Turn an array of stroke points into a path of quadradic curves.
 *
 * @param points - The stroke points returned from perfect-freehand
 * @param closed - Whether the shape is closed
 * @public
 */
function getSvgPathFromStrokePoints(points, closed = false) {
	const len = points.length;

	if (len < 2) {
		return "";
	}

	let a = points[0].point;
	let b = points[1].point;

	if (len === 2) {
		return `M${precise(a)}L${precise(b)}`;
	}

	let result = "";

	for (let i = 2, max = len - 1; i < max; i++) {
		a = points[i].point;
		b = points[i + 1].point;
		result += averageVect(a, b);
	}

	if (closed) {
		// If closed, draw a curve from the last point to the first
		return `M${averageVect(points[0].point, points[1].point)}Q${precise(
			points[1].point
		)}${averageVect(points[1].point, points[2].point)}T${result}${averageVect(
			points[len - 1].point,
			points[0].point
		)}${averageVect(points[0].point, points[1].point)}Z`;
	} else {
		// If not closed, draw a curve starting at the first point and
		// ending at the midpoint of the last and second-last point, then
		// complete the curve with a line segment to the last point.
		return `M${precise(points[0].point)}Q${precise(
			points[1].point
		)}${averageVect(points[1].point, points[2].point)}${
			points.length > 3 ? "T" : ""
		}${result}L${precise(points[len - 1].point)}`;
	}
}
