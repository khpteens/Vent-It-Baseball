// Boot.js

var Vent = Vent || {};
var	hasTouch;

Vent.Boot = function() {};

// setting game configuration and loading the assets for the loading screen
Vent.Boot.prototype = {	
	preload: function() {
		
		// assets we'll use in the loading screen
		this.load.image('logo', 'assets/img/logo.png');
		this.load.image('preloadbar', 'assets/img/preloader-bar.png');

		hasTouch = this.game.device.touch;		
	},
	create: function() {

		// loading screen will have a black background
		this.game.stage.backgroundColor = 0x000000;

		// scaling options		
		this.scale.scaleMode =  Phaser.ScaleManager.SHOW_ALL; // fit full width and height of screen
		// this.scale.scaleMode =  Phaser.ScaleManager.RESIZE; // square version
		this.scale.minWidth = 240;
		this.scale.minHeight = 170;
		this.scale.maxWidth = 2880;
		this.scale.maxHeight = 1920;

		// have the game centered horizontally and vertically
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		// screen size will be set automatically
		this.scale.setScreenSize(true);

		// enable to allow framerate testing
		this.time.advancedTiming = true;	
			

		// Screen Transitions
		// load transition plugin. Source is here https://github.com/aaccurso/phaser-state-transition-plugin
		this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);
		//define new properties to be tweened, duration, even ease
		this.game.stateTransition.configure({
		  duration: Phaser.Timer.SECOND * 0.8,
		  ease: Phaser.Easing.Exponential.Out,
		  properties: {
		    alpha: 0,
		    scale: {
		      x: 0.5,
		      y: 0.5
		    } //, angle: 0
		  }
		});		

		this.game.plugins.add(Phaser.Plugin.SaveCPU);

		this.state.start('Preload');
	}
};