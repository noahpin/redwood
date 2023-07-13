/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/perfect-freehand@1.2.0/dist/cjs/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function $(e, t, s, x = (h) => h) {
	return e * x(0.5 - t * (0.5 - s));
}
function ce(e) {
	return [-e[0], -e[1]];
}
function l(e, t) {
	return [e[0] + t[0], e[1] + t[1]];
}
function a(e, t) {
	return [e[0] - t[0], e[1] - t[1]];
}
function b(e, t) {
	return [e[0] * t, e[1] * t];
}
function xe(e, t) {
	return [e[0] / t, e[1] / t];
}
function R(e) {
	return [e[1], -e[0]];
}
function B(e, t) {
	return e[0] * t[0] + e[1] * t[1];
}
function me(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}
function Se(e) {
	return Math.hypot(e[0], e[1]);
}
function Pe(e) {
	return e[0] * e[0] + e[1] * e[1];
}
function A(e, t) {
	return Pe(a(e, t));
}
function G(e) {
	return xe(e, Se(e));
}
function ae(e, t) {
	return Math.hypot(e[1] - t[1], e[0] - t[0]);
}
function L(e, t, s) {
	let x = Math.sin(s),
		h = Math.cos(s),
		y = e[0] - t[0],
		n = e[1] - t[1],
		f = y * h - n * x,
		d = y * x + n * h;
	return [f + t[0], d + t[1]];
}
function K(e, t, s) {
	return l(e, b(a(t, e), s));
}
function ee(e, t, s) {
	return l(e, b(t, s));
}
var { min: C, PI: ke } = Math,
	le = 0.275,
	V = ke + 1e-4;
function getStrokeOutlinePoints(e, t = {}) {
	let {
			size: s = 16,
			smoothing: x = 0.5,
			thinning: h = 0.5,
			simulatePressure: y = !0,
			easing: n = (r) => r,
			start: f = {},
			end: d = {},
			last: D = !1,
		} = t,
		{ cap: S = !0, easing: j = (r) => r * (2 - r) } = f,
		{ cap: q = !0, easing: c = (r) => --r * r * r + 1 } = d;
	if (e.length === 0 || s <= 0) return [];
	let p = e[e.length - 1].runningLength,
		g = f.taper === !1 ? 0 : f.taper === !0 ? Math.max(s, p) : f.taper,
		T = d.taper === !1 ? 0 : d.taper === !0 ? Math.max(s, p) : d.taper,
		oe = Math.pow(s * x, 2),
		_ = [],
		M = [],
		H = e.slice(0, 10).reduce((r, i) => {
			let o = i.pressure;
			if (y) {
				let u = C(1, i.distance / s),
					W = C(1, 1 - u);
				o = C(1, r + (W - r) * (u * le));
			}
			return (r + o) / 2;
		}, e[0].pressure),
		m = $(s, h, e[e.length - 1].pressure, n),
		U,
		X = e[0].vector,
		z = e[0].point,
		F = z,
		O = z,
		E = F,
		J = !1;
	for (let r = 0; r < e.length; r++) {
		let { pressure: i } = e[r],
			{ point: o, vector: u, distance: W, runningLength: I } = e[r];
		if (r < e.length - 1 && p - I < 3) continue;
		if (h) {
			if (y) {
				let v = C(1, W / s),
					Z = C(1, 1 - v);
				i = C(1, H + (Z - H) * (v * le));
			}
			m = $(s, h, i, n);
		} else m = s / 2;
		U === void 0 && (U = m);
		let fe = I < g ? j(I / g) : 1,
			be = p - I < T ? c((p - I) / T) : 1;
		m = Math.max(0.01, m * Math.min(fe, be));
		let se = (r < e.length - 1 ? e[r + 1] : e[r]).vector,
			Y = r < e.length - 1 ? B(u, se) : 1,
			he = B(u, X) < 0 && !J,
			ue = Y !== null && Y < 0;
		if (he || ue) {
			let v = b(R(X), m);
			for (let Z = 1 / 13, w = 0; w <= 1; w += Z)
				(O = L(a(o, v), o, V * w)),
					_.push(O),
					(E = L(l(o, v), o, V * -w)),
					M.push(E);
			(z = O), (F = E), ue && (J = !0);
			continue;
		}
		if (((J = !1), r === e.length - 1)) {
			let v = b(R(u), m);
			_.push(a(o, v)), M.push(l(o, v));
			continue;
		}
		let ie = b(R(K(se, u, Y)), m);
		(O = a(o, ie)),
			(r <= 1 || A(z, O) > oe) && (_.push(O), (z = O)),
			(E = l(o, ie)),
			(r <= 1 || A(F, E) > oe) && (M.push(E), (F = E)),
			(H = i),
			(X = u);
	}
	let P = e[0].point.slice(0, 2),
		k =
			e.length > 1 ? e[e.length - 1].point.slice(0, 2) : l(e[0].point, [1, 1]),
		Q = [],
		N = [];
	if (e.length === 1) {
		if (!(g || T) || D) {
			let r = ee(P, G(R(a(P, k))), -(U || m)),
				i = [];
			for (let o = 1 / 13, u = o; u <= 1; u += o) i.push(L(r, P, V * 2 * u));
			return i;
		}
	} else {
		if (!(g || (T && e.length === 1)))
			if (S)
				for (let i = 1 / 13, o = i; o <= 1; o += i) {
					let u = L(M[0], P, V * o);
					Q.push(u);
				}
			else {
				let i = a(_[0], M[0]),
					o = b(i, 0.5),
					u = b(i, 0.51);
				Q.push(a(P, o), a(P, u), l(P, u), l(P, o));
			}
		let r = R(ce(e[e.length - 1].vector));
		if (T || (g && e.length === 1)) N.push(k);
		else if (q) {
			let i = ee(k, r, m);
			for (let o = 1 / 29, u = o; u < 1; u += o) N.push(L(i, k, V * 3 * u));
		} else
			N.push(
				l(k, b(r, m)),
				l(k, b(r, m * 0.99)),
				a(k, b(r, m * 0.99)),
				a(k, b(r, m))
			);
	}
	return _.concat(N, M.reverse(), Q);
}
function getStrokePoints(e, t = {}) {
	var q;
	let { streamline: s = 0.5, size: x = 16, last: h = !1 } = t;
	if (e.length === 0) return [];
	let y = 0.15 + (1 - s) * 0.85,
		n = Array.isArray(e[0])
			? e
			: e.map(({ x: c, y: p, pressure: g = 0.5 }) => [c, p, g]);
	if (n.length === 2) {
		let c = n[1];
		n = n.slice(0, -1);
		for (let p = 1; p < 5; p++) n.push(K(n[0], c, p / 4));
	}
	n.length === 1 && (n = [...n, [...l(n[0], [1, 1]), ...n[0].slice(2)]]);
	let f = [
			{
				point: [n[0][0], n[0][1]],
				pressure: n[0][2] >= 0 ? n[0][2] : 0.25,
				vector: [1, 1],
				distance: 0,
				runningLength: 0,
			},
		],
		d = !1,
		D = 0,
		S = f[0],
		j = n.length - 1;
	for (let c = 1; c < n.length; c++) {
		let p = h && c === j ? n[c].slice(0, 2) : K(S.point, n[c], y);
		if (me(S.point, p)) continue;
		let g = ae(p, S.point);
		if (((D += g), c < j && !d)) {
			if (D < x) continue;
			d = !0;
		}
		(S = {
			point: p,
			pressure: n[c][2] >= 0 ? n[c][2] : 0.5,
			vector: G(a(S.point, p)),
			distance: g,
			runningLength: D,
		}),
			f.push(S);
	}
	return (f[0].vector = ((q = f[1]) == null ? void 0 : q.vector) || [0, 0]), f;
}
function getStroke(e, t = {}) {
	return getStrokeOutlinePoints(getStrokePoints(e, t), t);
}
