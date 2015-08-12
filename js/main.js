// main.js

var Vent = Vent || {};

// create game object
Vent.game = new Phaser.Game(settings.WIDTH, settings.HEIGHT, Phaser.CANVAS, settings.CONTAINER);

// create game states
Vent.game.state.add('Boot', Vent.Boot);
Vent.game.state.add('Preload', Vent.Preload);
Vent.game.state.add('MainMenu', Vent.MainMenu);
Vent.game.state.add('Pick', Vent.Pick);
Vent.game.state.add('Game', Vent.Game);
Vent.game.state.add('Finish', Vent.Finish);
Vent.game.state.add('Contact', Vent.Contact);
Vent.game.state.add('Success', Vent.Success);

// run
Vent.game.state.start('Boot');