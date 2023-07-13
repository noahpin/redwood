var handTopLayer = document.getElementById("handwritingTop");
var textEditableArea = document.getElementById("textEditable");
var appContainer = document.getElementById('app-container');
var textEditableBounds = getOffsetRect(textEditableArea);

document.onkeydown = function (e) {
	textEditableArea.focus();
}

textEditableArea.onfocus = function () {
	document.getElementById("text-editor-settings").classList.add("open");
}
textEditableArea.onblur = function () {
	document.getElementById("text-editor-settings").classList.remove("open");
}

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
	}
});
resizeobserver.observe(textEditableArea);

function draw(pts, id) {
	const outlinePoints = getStroke(pts, {size: 8, simulatePressure: true });
	//draw svg on handTopLayer object. both should just be paths with fill:none and stroke:black

	//draw outline path
	let outlinePath = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	outlinePath.id = id;
	//create path string, iterate through pts
	let outlinePathData = getSvgPathFromStroke(outlinePoints);
	outlinePath.setAttributeNS(null, "d", outlinePathData);
	outlinePath.setAttributeNS(null, "fill", "var(--editor-draw-primary)");
	handTopLayer.appendChild(outlinePath);
}

function updatePath(id) {
	if (handTopLayer.getElementById(id)) {
		handTopLayer.getElementById(id).remove();
	}
	draw(toplevelPaths[id].path, id);
}

let toplevelPaths = {};

let drawnPath = [];
let activePath = null;

var isPen = false;

document.body.addEventListener(
	"pointerdown",
	function (e) {
		if (e.pointerType === "pen") {
			isPen = true;
			console.log("draw");
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

document.body.addEventListener(
	"touchstart",
	function (e) {
		if (isPen) {
			e.preventDefault();
			console.log(e);
			activePath = genId();
			toplevelPaths[activePath] = {
				path: [
					[
						e.touches[0].clientX - textEditableBounds.left + window.scrollX,
						e.touches[0].clientY - textEditableBounds.top + appContainer.scrollTop,
						e.touches[0].force,
					],
				],
				options: {},
			};
		}
	},
	{
		passive: false,
		capture: false,
	}
);

document.ontouchmove = function (e) {
	e.stopPropagation();
	e.stopImmediatePropagation();
	e.preventDefault();
	console.clear();
	console.log("touchmove" + Date.now());
	if (activePath) {
		if (e.touches[0].clientY - textEditableBounds.top + appContainer.scrollTop > textEditableBounds.height - 250) {
			textEditableArea.style.minHeight = textEditableBounds.height + 250 + "px";
		}
		toplevelPaths[activePath].path.push([
			e.touches[0].clientX - textEditableBounds.left + window.scrollX,
			e.touches[0].clientY - textEditableBounds.top + appContainer.scrollTop,
			e.touches[0].force,
		]);
		updatePath(activePath);
	}
};

document.ontouchend = function (e) {
	e.stopPropagation();
	e.stopImmediatePropagation();
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


function getOffsetRect  (el) {
  let rect   = el.getBoundingClientRect();

  // add window scroll position to get the offset position
  let left   = rect.left   + window.scrollX;
  let top    = rect.top    + appContainer.scrollTop;
  let right  = rect.right  + window.scrollX;
  let bottom = rect.bottom + appContainer.scrollTop;

  // polyfill missing 'x' and 'y' rect properties not returned
  // from getBoundingClientRect() by older browsers
  let x = rect.x === undefined ? left : rect.x + window.scrollX;
  let y = rect.y === undefined ? top : rect.y + appContainer.scrollTop;

  // width and height are the same
  let width  = rect.width;
  let height = rect.height;

  return { left, top, right, bottom, x, y, width, height };
};