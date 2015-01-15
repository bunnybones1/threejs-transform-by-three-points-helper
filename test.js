var onReady = function() {
	var View = require('threejs-managed-view').View;
	var transformByThreePoints = require('threejs-transform-by-three-points');
	var Helper = require('./');
	var view = new View({
		useRafPolyfill: false
	});
	var scene = view.scene;

	var spin = new THREE.Object3D();
	view.scene.add(spin);
	var pointsDatas = [
		[
			[-3, 2, 0],
			[-1, 2, 1],
			[-3, 0, .5]
		],
		[
			[1, 2, 0],
			[3, 2, 1],
			[1, 0, .5]
		]
	];

	var pointGroups = [];
	var helpers = [];
	pointsDatas.forEach(function(pointsData){
		var points = [];
		pointGroups.push(points);
		pointsData.forEach(function(pointData){
			var point = new THREE.Vector3();
			point.fromArray(pointData);
			points.push(point);
		});
		var helper = new Helper(points[0], points[1], points[2]);
		helpers.push(helper);
		spin.add(helper);
	});

	view.renderManager.onEnterFrame.add(function() {
		var time = (new Date()).getTime() * .001;
		spin.rotation.y += .002;

		//update handles from points
		var points = pointGroups[0];
		var pos = pointsDatas[0][2];
		points[2].set(
			Math.sin(time) - .5 + pos[0],
			Math.cos(time) - .5	+ pos[1],
			Math.sin(time*1.2) + pos[2]
		)
		transformByThreePoints(testObjects[0], points[0], points[1], points[2]);
		transformByThreePoints(testObjects[1], points[1], points[0], points[2], true);
		helpers[0].update();

		//update points from handles
		points = pointGroups[1];
		pos = pointsDatas[1][1];
		helpers[1].handles[1].position.set(
			Math.sin(time*1.3) - .5 + pos[0],
			Math.cos(time*.8) - .5	+ pos[1],
			Math.sin(time*4.4) + pos[2]
		)
		pos = pointsDatas[1][0];
		helpers[1].handles[0].position.set(
			Math.sin(time*.9) - .5 + pos[0],
			Math.cos(time*.7) - .5	+ pos[1],
			Math.sin(time*.45) + pos[2]
		)
		transformByThreePoints(testObjects[2], points[0], points[1], points[2]);
		transformByThreePoints(testObjects[3], points[1], points[0], points[2], true);
		helpers[1].updatePoints();
	})
	var planeMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(8, 8, 8, 8),
		new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0x7f7f7f
		})
	)
	planeMesh.rotation.x += Math.PI * .5;
	spin.add(planeMesh);

	function createTestObject(color) {
		var testObject = new THREE.Object3D();
		var testMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1, 1, 1),
			new THREE.MeshBasicMaterial({
				// wireframe: true,
				color: color
			})
		)
		testObject.add(new THREE.ArrowHelper(
			new THREE.Vector3(1, 0, 0),
			new THREE.Vector3(),
			1,
			0xff0000
		));
		testObject.add(new THREE.ArrowHelper(
			new THREE.Vector3(0, -1, 0),
			new THREE.Vector3(),
			1,
			0x00ff00
		));
		testObject.add(new THREE.ArrowHelper(
			new THREE.Vector3(0, 0, 1),
			new THREE.Vector3(),
			1,
			0x0000ff
		));
		// testMesh.position.x = .5;
		// testMesh.position.y = -.5;
		testObject.add(testMesh);
		spin.add(testObject);
		return testObject;
	}
	var testObjects = [];
	testObjects.push(createTestObject(0x3f3faf), createTestObject(0x3f3faf));
	testObjects.push(createTestObject(0xaf3f3f), createTestObject(0xaf3f3f));
}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);