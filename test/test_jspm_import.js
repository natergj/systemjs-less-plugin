var assert = require('assert'),
	Builder = require('jspm').Builder,
	builder = new Builder(),

	fs = require('fs'),
	pathexample = 'example/example_jspm_import.less',
	pathbundle = 'example/example_jspm_import.js',
	pathbundlesfx = 'example/example_sfx_jspm_import.js';


describe('Bundle less file', function () {
	this.timeout(4000);
	it('Should be able to run jspm bundle to compile and bundle a less file', function (done) {
		fs.exists(pathbundle, function (exists) {
			if (exists) {
				fs.unlinkSync(pathbundle);
			}

			builder.bundle(pathexample, pathbundle, {
				minify: false,
				sourceMaps: true
			}).then(function () {
				done();
			}).catch(function (err) {
				console.error('Bundle falla');
				console.trace(err);
				throw err;
			});
		});

	});


});


describe('Static build less file', function () {
	this.timeout(4000);
	it('Should be able to run jspm build to compile and bundle a less file', function (done) {
		fs.exists(pathbundlesfx, function (exists) {
			if (exists) {
				fs.unlinkSync(pathbundlesfx);
			}

			builder.buildStatic(pathexample, pathbundlesfx, {
				minify: false,
				sourceMaps: true,
				format: 'cjs'
			}).then(function () {
				done();
			}).catch(function (err) {
				console.error('Bundle fails');
				console.trace(err);
				throw err;
			});
		});

	});
});

describe('Compile url(filename) correctly', function () {
	it('should compile url(data:...) property correctly', function () {
		builder.bundle(pathexample, {
			minify: false,
			sourceMaps: true,
			format: 'cjs'
		}).then(function (file) {
			assert.ok(/url\(example\/file.png\)/.test(file.source));
		}).catch(function (err) {
			assert.ok(false);
		});
	});
});


describe('Compile url(data:...) correctly', function () {
	it('should compile url(data:...) property correctly', function () {
		builder.bundle(pathexample, {
			minify: false,
			sourceMaps: true,
			format: 'cjs'
		}).then(function (file) {
			assert.ok(/url\(data:image\/png;base64.*\)/.test(file.source));
			//assert.ok(/url\("data:image\/png;base64.*"\)/.test(file.source));
			assert.ok(/url\('data:image\/png;base64.*'\)/.test(file.source));
		}).catch(function (err) {
			assert.ok(false);
		});
	});
});


describe('Compile styles correctly', function () {
	this.timeout(2000);

	var code;

	it('Autoprefixer should remove -webkit-border-radius', function (done) {
		setTimeout(function () {
			code = code || fs.readFileSync(pathbundle);
			assert.ok(/-webkit-border-radius:20px/.test(code) === false);
			done();
		}, 100);
	});
	it('Autoprefixer should remove -moz-border-radius', function () {
		code = code || fs.readFileSync(pathbundle);
		assert.ok(/-moz-border-radius:20px/.test(code) === false);
	});
	it('should compile border-radius property correctly', function () {
		code = code || fs.readFileSync(pathbundle);
		assert.ok(/border-radius:20px/.test(code));
	});

});


describe('Compile styles correctly in bundle sfx', function () {
	this.timeout(2000);

	var code;

	it('Autoprefixer should remove -webkit-border-radius', function (done) {
		setTimeout(function () {
			code = code || fs.readFileSync(pathbundlesfx);
			assert.ok(/-webkit-border-radius:20px/.test(code) === false);
			done();
		}, 100);
	});
	it('Autoprefixer should remove -moz-border-radius', function () {
		code = code || fs.readFileSync(pathbundlesfx);
		assert.ok(/-moz-border-radius:20px/.test(code) === false);
	});
	it('should compile border-radius property correctly', function () {
		code = code || fs.readFileSync(pathbundlesfx);
		assert.ok(/border-radius:20px/.test(code));
	});

});