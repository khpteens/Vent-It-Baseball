// Game.js

var Vent = Vent || {};

//title screen
Vent.Game = function() {};

/********************************************************************/

// constants colours
var COLOUR_WHITE = 0xffffff,
	COLOUR_BLACK = 0x000000;

var hitTotal = 0,
	trail = null, // mouse trail particle emitter
	trailOn = false,
	barTotal = 0,
	mode; // "pitch" or "swing"

// groups
var buttons, userInterface, bar_group, bg_group, ball_group;

// arrays
var hits = [],
	hitSounds = [],
	hitsToDestroy = [],
	playing = [],
	stopPlaying = [],
	bars = [];

var graphics = null;

var bgGame,
	hitGoal_txt,
	sw, sw2, sb,
	lastX = 0,
	lastY = 500;

var audioLength = 100,
	audioFileName,
	audioComplete = false,
	averages = [],
	volumes = [],
	all = [],
	balls = [],
	bat, ball, pop, pitcher, batSwing;

/********************************************************************/

Vent.Game.prototype = {
	create: function() {

		createWorldSettings();

		bg_group = Vent.game.add.group();
		bgGame = Vent.game.add.sprite(0, 0, "field");
		bgGame.width = Vent.game.world.width;
		bgGame.height = Vent.game.world.height;
		bgGame.inputEnabled = true;
		bg_group.add(bgGame);

		create_pitcher();

		init_pop();
		create_particle_layer();
		createCopyright();

		createAudio();
		setup_game();

		createUI();

		create_instructions_prompt();
	},
	update: function() {

		updateUI();
		pitch_update();
		hit_update();
	},
	render: function() {
		// this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
	}
};

function create_pitcher() {

	// add pitcher
	pitcher = Vent.game.add.sprite(Vent.game.world.width / 2 - 17, Vent.game.world.height / 2 + 14, "pitcher");
	pitcher.animations.add('pitch');
	pitcher.anchor.set(0.5);
	pitcher.scale.set(0.5);
	pitcher.tint = 0x111111;
	pitcher.alpha = 1;
}

function create_instructions_prompt() {

	var prompt = Vent.game.add.group();

	var clickblock = Vent.game.add.graphics(0, 0);
	clickblock.inputEnabled = true;
	clickblock.beginFill(0x000000, 1);
	clickblock.boundsPadding = 0;
	clickblock.drawRect(0, 0, Vent.game.width, Vent.game.height - 30);
	clickblock.alpha = 0;
	prompt.add(clickblock);

	var overlay = Vent.game.add.graphics(0, 0);
	overlay.beginFill(0x000000, 1);
	overlay.boundsPadding = 0;
	overlay.drawRect(0, Vent.game.height / 2 - 100, Vent.game.width, 200);
	overlay.alpha = 0.5;
	prompt.add(overlay);

	// Instructions
	text = "1. Click to pitch.\n2. Then click on the ball to hit it.";
	if (hasTouch) text = "1. Tap to pitch.\n2. Then tap on the ball to hit it.";
	winText = Vent.game.add.text(settings.WIDTH / 2, settings.HEIGHT / 2 - 40, text, p_style);
	winText.anchor.set(0.5);
	prompt.add(winText);

	// Continue button
	ContinueBt = Vent.game.add.sprite(settings.WIDTH / 2, settings.HEIGHT / 2 + 45, 'square');
	createBt(ContinueBt, "Continue", false);
	ContinueBt.events.onInputUp.add(function() {
		prompt.visible = false;

	}, this);
	prompt.add(ContinueBt.group);

	prompt.bringToTop = true;
}

function createWorldSettings() {
	Vent.game.world.setBounds(0, 0, settings.WIDTH, settings.HEIGHT);
	Vent.game.stage.backgroundColor = 0x222222;
}

function createUI() {
	createInputListeners();
	createButtons();

	// border around Ball # & icon
	var border = Vent.game.add.graphics(0, 0);
	border.lineStyle(2, 0xffffff, 1);
	if (hitGoal <= 99) {
		border.drawRect(Vent.game.width - 169, -1, 110, 60);
	} else {
		border.drawRect(Vent.game.width - 179, -1, 120, 60);
	}
	border.boundsPadding = 0;
	userInterface.add(border);

	// # of balls
	hitGoal_txt = Vent.game.add.text(Vent.game.width - 120, 32, commaSeparateNumber(hitGoal), h3_style);
	hitGoal_txt.anchor.set(1, 0.5);
	userInterface.add(hitGoal_txt);

	// ball icon
	hitGoal_icon = Vent.game.add.sprite(Vent.game.width - 95, 29, "icon-baseball");
	hitGoal_icon.height = hitGoal_icon.width = 30;
	hitGoal_icon.anchor.set(0.5);
	userInterface.add(hitGoal_icon);
}

function updateUI() {
	var currentHits = hitGoal - hitTotal;

	if (hitGoal_txt.text !== String(currentHits)) {

		hitGoal_txt.text = commaSeparateNumber(currentHits);
		if (currentHits == 0) hitGoal_txt.text = "";
	}
}

function createInputListeners() {

	bgGame.events.onInputDown.add(function() {
		if (mode == "swing") {
			swing_start();
		}
	}, this);

	bgGame.events.onInputUp.add(function() {
		if (mode == "pitch") {
			pitch_start();
		}
	}, this);
}

function createButtons() {

	userInterface = Vent.game.add.group(); // create a group to contain all option screen elements

	var ExitBt = Vent.game.add.sprite(Vent.game.width - 29, 29, "square");
	createBt(ExitBt, "icon-x", false, "circle");
	ExitBt.events.onInputUp.add(function() {
		gameExit(500);
	});
	userInterface.add(ExitBt);
	userInterface.add(ExitBt.border);
	userInterface.add(ExitBt.label);
}

function setup_game() {

	mode = "pitch";

	// create balls group	
	ball = Vent.game.add.sprite(0, 0, "ball");
	ball.anchor.set(0.5);
	ball.scale.set(0);
	ball.alpha = 0;

	// create bat & hide it
	bat = Vent.game.add.sprite(-50, Vent.game.height / 3 * 2, "bat");
	bat.anchor.set(0, 0.5);
	bat.scale.set(0.6);
	bat.alpha = 0;
	bat.tint = 0xbbbbbb;
}

function pitch_update() {

	if (mode == "swing") {
		var gravity = 1;

		ball.loft += gravity;
		ball.y += ball.loft + ball.driftY;
		ball.x += ball.driftX;

		if (ball.scale.x < 1) {
			ball.scale.x += 0.02;
			ball.scale.y += 0.02;
		} else if (ball.y > Vent.game.world.height) {
			ball.alpha = 0;
			ball.x = ball.y = 0;
			mode = "pitch";
			pitcher.frame = 0;				
		}
	}
}

function hit_update(){
	if (mode == "hit"){

	}
}

function pitch_start() {

	if (hitTotal < hitGoal) {
		pitcher.animations.play('pitch', 15);

		setTimeout(function() {
			pitch_throw();
			mode = "swing";
		}, 700);
	}
}

function pitch_throw() {

	ball.x = Vent.game.width / 2;
	ball.y = Vent.game.height / 2;
	ball.scale.set(0);
	ball.alpha = 1;
	ball.loft = -10;

	var driftMod = 8;
	ball.driftX = Math.random() * driftMod - driftMod / 2;
	ball.driftY = Math.random() * driftMod - driftMod;
}

function swing_start() {

	var pointerX = Vent.game.input.activePointer.x;
	var pointerY = Vent.game.input.activePointer.y;

	bat.alpha = 1;
	bat.angle = 45;
	bat.scale.set(1);
	bat.x = pointerX - 400;
	bat.y = pointerY;

	Vent.game.add.tween(bat).to({
		angle: -150
	}, 700, Phaser.Easing.Cubic.Out, true);
	Vent.game.add.tween(bat.scale).to({
		x: 0,
		y: 0
	}, 500, Phaser.Easing.Cubic.In, true);

	var deltaX = Math.abs(pointerX - ball.x),
		deltaY = Math.abs(pointerY - ball.y),
		radius = ball.width / 4 * 3; // make hit area larger than ball for ease of play

	if (deltaX < radius && deltaY < radius) {
		ball.alpha = 0;
		createHit();
	}

	playAudio(bat_swing);
}

function createTrailGraphic(x, y, x2, y2) {
	if (graphics != null) {
		graphics.destroy();
	}
	graphics = Vent.game.add.graphics(0, 0);

	graphics.lineStyle(1, 0xffffff, 1);

	graphics.moveTo(swipeCoordX, swipeCoordY);
	graphics.lineTo(Vent.game.input.activePointer.x, Vent.game.input.activePointer.y);
	// graphics.alpha = 0.4;
}

function removeTrailGraphic() {

	graphics.destroy();
	graphics = null;
}

function createTrail() {

	trail = Vent.game.add.emitter(Vent.game.input.activePointer.x, Vent.game.input.activePointer.y, 200);
	trail.makeParticles(["smoke1", "smoke1", "smoke3"]); // set sprite or an array of sprites to use as particles
	//trail.bringToTop = true;

	// ALPHA
	trail.setAlpha(1, 0, 1000, Phaser.Easing.Cubic.Out); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	trail.setScale(1, 0.5, 1, 0.5, 1000, Phaser.Easing.Cubic.Out); // (x start, x end, y start, y end, animation duration, Type of ease)    

	trail.minParticleSpeed.setTo(-10, -10); // x speed, y speed
	trail.maxParticleSpeed.setTo(10, 10); // x speed, y speed

	// ROTATION    
	trail.setRotation(0, 0); // (start rotation, end rotation, duration, ease) default is (0, 360)

	trail.gravity = 0; // default is 0;  

	// START
	// 1. set the effect to "explode" which means all particles are emitted at once
	// 2. each particle's lifespan (ms). 
	// 3. set the rate of particle emission in particles per frame. This is ignored when parameter 1 is true.
	// 4. # of particles to be emitted.
	trail.start(false, 1000, 0.5, 200);

	updateTrail();
}

function startTrail() {

	createTrail();
}

function stopTrail() {

	trail.destroy();
	trail = null;
}

function updateTrail() {

	if (trail != null) {
		// make trail follow pointer
		trail.emitX = Vent.game.input.activePointer.x;
		trail.emitY = Vent.game.input.activePointer.y;

		createTrailGraphic();
	}
}

function createAudio() {

	hit1 = Vent.game.add.audio('hit1');
	hit2 = Vent.game.add.audio('hit2');
	hit3 = Vent.game.add.audio('hit3');
	hit4 = Vent.game.add.audio('hit4');
	hit5 = Vent.game.add.audio('hit5');
	cheer = Vent.game.add.audio('cheer');
	bat_swing = Vent.game.add.audio('swing');

	hitSounds = [hit1, hit2, hit3];
}

function createVisualization() {

	// create sound bars

	// add bouncing background
	// sb = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "square");
	// sb.width = Vent.game.width;
	// sb.height = Vent.game.height;
	// sb.anchor.set(0.5);
	// sb.tint = 0x444444;
	// bg_group.add(sb);

	// create a group to keep all bars at the same depth
	bars_group = Vent.game.add.group();

	sw = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "wave");
	sw.width = 0;
	sw.height = 0;
	sw.anchor.set(0.5);

	sw2 = Vent.game.add.sprite(Vent.game.width / 2, Vent.game.height / 2, "wave");
	sw2.width = 0;
	sw2.height = 0;
	sw2.anchor.set(0.5);
	sw2.rotation = 45;
}

function gameExit(delay) {

	// remove input listeners
	Vent.game.input.onDown.removeAll();
	Vent.game.input.onUp.removeAll();

	Vent.game.add.tween(pitcher).to({
		alpha: 0
	}, 600, Phaser.Easing.Cubic.Out, true);
	Vent.game.add.tween(userInterface).to({
		alpha: 0
	}, 600, Phaser.Easing.Cubic.Out, true);

	// delayed call to exit current state
	setTimeout(function() {

		// reset game
		hitTotal = 0;
		destroyAllHits();

		// visualization
		barTotal = 0;
		playing = [];
		// sw.width = sw2.width = 0;
		// sw.height = sw2.height = 0;
		// sb.width = Vent.game.width * 2;
		// sb.height = Vent.game.height * 2;

		// go to Finish screen
		if (!hasTouch) {
			Vent.game.stateTransition.to("Finish");
		} else {
			Vent.game.state.start("Finish");
		}

	}, delay);
}

function create_particle_layer() {

	particles = Vent.game.add.group(); // create a group to contain all particles
	ball_group = Vent.game.add.group();
}

function createHit() {

	hitTotal++;

	var r = Math.floor(Math.random() * hitSounds.length);
	playAudio(hitSounds[r]);

	var r2 = Math.floor(Math.random() * 4); // 0,1,2,3        
	if (r2 == 0) {
		setTimeout(function() {
			playAudio(cheer);
		}, 1000);
	}

	var x = Vent.game.input.activePointer.x;
	var y = Vent.game.input.activePointer.y;

	createSmoke(x, y);
	createSplinters(x, y);
	createBall(ball.x, ball.y);
	// createBall_2(ball.x, ball.y);

	if (!hasTouch) create_bg_pop();

	if (hitTotal >= hitGoal) {
		gameExit(3500);
		playAudio(cheer);
	}
}

function init_pop() {
	pop = Vent.game.add.sprite(0, 0, "circle");
	pop.alpha = 0;
	bg_group.add(pop);
}

function create_bg_pop() {

	var pointerX = Vent.game.input.activePointer.x;
	var pointerY = Vent.game.input.activePointer.y;

	pop.x = pointerX;
	pop.y = pointerY;
	pop.width = pop.height = 0;
	pop.anchor.set(0.5);
	pop.tint = Math.random() * 0xffffff;
	pop.alpha = 1;

	Vent.game.add.tween(pop).to({
		width: 900,
		height: 900,
		alpha: 0
	}, 1000, Phaser.Easing.Exponential.Out, true);
}

function createSplinters(x, y) {

	var em = Vent.game.add.emitter(x, y, 4); // x, y and # of particles
	// particles auto rotate and auto fade based on their lifespan.

	em.makeParticles(["wood1", "wood2", "wood3", "wood4", "dirt2"]); // set sprite or an array of sprites to use as particles
	em.bringToTop = true;

	// ALPHA
	em.setAlpha(1, 1, 3000); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	em.setScale(0, 0.5, 0, 0.5, 3000); // (x start, x end, y start, y end, animation duration, Type of ease)    

	em.minParticleSpeed.setTo(-500, -600); // x speed, y speed
	em.maxParticleSpeed.setTo(500, 200); // x speed, y speed

	// ROTATION    
	em.setRotation(-360, 360, 3000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.gravity = 500; // default is 0;

	em.start(true, 3000, null, 50);

	particles.add(em); // add to particles group
	hits.push(em);
}

function createBall(x, y) {

	var em = Vent.game.add.emitter(x, y, 1); // x, y and # of particles
	// particles auto rotate and auto fade based on their lifespan.

	em.makeParticles("ball"); // set sprite or an array of sprites to use as particles
	em.bringToTop = true;

	// ALPHA
	em.setAlpha(1, 1, 3000); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	/* AWAY FROM USER */

	// SCALE
	// Linear (no in, etc.), Quadratic, Cubic, Quartic, Quintic, Exponential, Sinusoidal, Circular, Elastic, Back, Bounce
	em.setScale(1, 0, 1, 0, 3000, Phaser.Easing.Quintic.Out); // (x start, x end, y start, y end, animation duration, Type of ease)    

	em.minParticleSpeed.setTo(-200, -800); // x speed, y speed
	em.maxParticleSpeed.setTo(200, -500); // x speed, y speed

	em.setRotation(-180, 180, 3000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.gravity = 900; // default is 0;
	/* */


	// START
	// 1. set the effect to "explode" which means all particles are emitted at once
	// 2. each particle's lifespan (ms). 
	// 3. set the rate of particle emission in particles per frame. This is ignored when parameter 1 is true.
	// 4. # of particles to be emitted.
	em.start(true, 3000, null, 50);

	hits.push(em);
}

function createBall_2(x, y) {

	var ball = Vent.game.add.sprite(x, y, "ball");
	ball.anchor.set(0.5);
	ball.scale.set(0.1);

	ball_group.add(ball);
}

function createSmoke(x, y) {

	var amount = 1;
	var smokeDuration = 2000;
	if (!hasTouch) {
		amount = 4;
		smokeDuration = 3000;
	}

	var em = Vent.game.add.emitter(x, y, amount); // x, y and # of particles    

	em.makeParticles(["smoke1", "smoke2", "smoke3"]); // set sprite or an array of sprites to use as particles        

	// ALPHA
	em.setAlpha(1, 0, smokeDuration); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	em.setScale(0, 5, 0, 5, 3000); // (x start, x end, y start, y end, animation duration, Type of ease)
	em.minParticleScale = 0; // set starting min scale
	em.maxParticleScale = 4; // set starting max scale

	em.minParticleSpeed.setTo(-200, -200); // x speed, y speed
	em.maxParticleSpeed.setTo(200, 200); // x speed, y speed

	// ROTATION
	em.setRotation(0, 180, 3000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.start(true, smokeDuration, null, 50);

	particles.add(em); // add to particles group
	hits.push(em);
}

function createWave(x, y) {

	var em = Vent.game.add.emitter(x, y, 2); // x, y and # of particles    

	em.makeParticles("wave"); // set sprite or an array of sprites to use as particles
	em.bringToTop = true;

	// ALPHA
	em.setAlpha(0.5, 0, 1000); // start alpha, end alpha, animation duration, will always fade out as lifespan ends

	// SCALE
	em.setScale(0, 0.35, 0, 0.35, 1000); // (x start, x end, y start, y end, animation duration, Type of ease)

	em.setRotation(-45, 45, 1000); // (start rotation, end rotation, duration, ease) default is (0, 360)

	em.gravity = 0; // default is 0;

	em.start(true, 1000, null, 1);

	particles.add(em); // add to particles group
	hits.push(em);
}

function updateHits() {

	var i = 0;
	var len = hits.length;
	var max = 9;

	if (len > max) {
		var lenR = len - max;
		for (var j = 0; j < lenR; j++) {
			hitsToDestroy.push(hits[j]);
		}
	}

	// update hits that are not currently being removed
	for (i = lenR; i < len; i++) {
		updateHit(hits[i]);
	}
	destroyHits();
}

function updateHit(h) {
	h.y += 2;

	h.width += 5;
	h.height += 5;
	h.alpha -= 0.01;

	if (h.y > Vent.game.world.height) {
		hitsToDestroy.push(h);
	}
}

function updateVisualization() {

	var len = playing.length,
		total = 0;

	if (len > 0) {
		for (var i = 0; i < len; i++) {

			var fr = playing[i].frame,
				nm = playing[i].name;

			if (fr >= audioData[nm].length) {
				playing[i].frame = -1;
			} else {
				playing[i].frame++;
				total += Number(audioData[nm][fr]);
			}
		}
		cleanPlayVisual();

		var scaleMod = 1 / 2,
			alphaMod = 1 / 100;

		// sb.width = Vent.game.width - total * scaleMod;
		// sb.height = Vent.game.height - total * scaleMod;

		// sw.width = sw.height = 800 - (total * 5);
		// sw.alpha = total * alphaMod;
		// sw.rotation += 5;

		// sw2.width = sw2.height = total * 5;
		// sw2.alpha = total * alphaMod;
		// sw.rotation -= 5;
		// sw.tint = sw2.tint = 0xffffff;

	}
	add_audio_bar(total);
}

function add_audio_bar(v) {

	var scaleMod = 2,
		shift = 0;

	var curY = v * scaleMod,
		curX = barTotal;
	if (lastY == 0 && lastX == 0) {
		lastY = curY;
	}

	var bar = Vent.game.add.sprite(curX, Vent.game.height + shift, "square");
	bar.width = 3;
	bar.height = curY;
	bar.anchor.set(0, 1);
	bar.tint = 0x777777;
	bars.push(bar);
	bars_group.add(bar);

	var line = Vent.game.add.graphics(0, 0);
	line.lineStyle(3, 0xffffff, 1);
	line.moveTo(lastX, Vent.game.height + shift - lastY);
	line.lineTo(curX, Vent.game.height + shift - curY);
	bars.push(line);
	bars_group.add(line);

	if (barTotal < Vent.game.width) {
		barTotal += 5;
		lastX = curX;
		lastY = curY;
	} else {
		bars_reset();
		lastX = 0;
		lastY = 0;
	}
}

function bars_reset() {
	barTotal = 0;
	for (var i = 0, len = bars.length; i < len; i++) {
		bars[i].destroy();
	}
	bars = [];
	lastY = 0;
	lastX = 0;
}

function cleanPlayVisual() {

	for (var i = 0; i < playing.length; i++) {
		if (playing[i].frame == -1) {
			playing.splice(i, 1);
			i -= 1;
		}
	}
}

// Garbage collection
function destroyAllHits() {
	for (var i = 0, len = hits.length; i < len; i++) {
		hitsToDestroy.push(hits[i]);
	}
	hits = [];
	destroyHits();
}

function destroyHits() {

	for (var i = 0, len = hitsToDestroy.length; i < len; i++) {
		destroyHit(hitsToDestroy[i]);
	}
	hitsToDestroy = [];
}

function destroyHit(h) {

	// 1. destroy sprite
	h.destroy();

	// 2. remove hit from hits array    
	for (var i = 0, len = hits.length; i < len; i++) {
		if (h == hits[i]) {
			hits.splice(i, 1);
		}
	}
}