
function TransformByThreePointsHelper(pointAnchor, pointLookAt, pointAlignTo) {
	var ballGeometry = new THREE.SphereGeometry(.25);

	var points = this.points = [
		pointAnchor,
		pointLookAt,
		pointAlignTo
	];

	var colors = [
		0x9f9f2f,
		0x7f2f2f,
		0x2f7f2f
	];

	THREE.Object3D.call(this);

	var handles = this.handles = [];
	for (var i = 0; i < points.length; i++) {
		var handle = new THREE.Mesh(
			ballGeometry,
			new THREE.MeshBasicMaterial({
				color: colors[i],
				depthTest: false,
				transparent: true,
				blending: THREE.AdditiveBlending
			})
		);
		handle.renderDepth = 1;
		handle.position.copy(points[i]);
		this.add(handle);
		handles.push(handle);
	};

	this.pointAnchor = pointAnchor;
	this.pointLookAt = pointLookAt;
	this.pointAlignTo = pointAlignTo;

}

TransformByThreePointsHelper.prototype = Object.create(THREE.Object3D.prototype);

TransformByThreePointsHelper.prototype.update = function() {
	for (var i = 0; i < this.handles.length; i++) {
		this.handles[i].position.copy(this.points[i]);
	};
}

TransformByThreePointsHelper.prototype.updatePoints = function() {
	for (var i = 0; i < this.handles.length; i++) {
		this.points[i].copy(this.handles[i].position);
	};
}

module.exports = TransformByThreePointsHelper;