// Google Analytics & Events

var analyticsOn = false; // switch on/off Google Analytics event tracking 

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', settings.GA_CODE, 'auto');
// ga('send', 'pageview');

function trackEvent(action, location) {

	gameName = settings.NAME;	

	var eventCategory = "Game events"; // file all Pic'd tracking events under "Game events" instead of "Interactives"

	var eventAction = gameName + ": " + action; // type of event (Click, etc)
	var eventLabel = gameName + ": " + location; // property of action (Splash screen, Win screen, etc)

	if (settings.ANALYTICS_ON) {		
		ga('send', 'event', eventCategory, eventAction, eventLabel);
	}
}