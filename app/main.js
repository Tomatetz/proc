require.config({ 
	baseUrl: "app",
    paths: {
		'router'				: 'router',
		'app'					: 'app',
		'templates'				: '../build/templates',
		'jquery'				: '../bower_components/jquery/dist/jquery',
		'backbone'				: '../bower_components/backbone/backbone',
		'underscore'			: '../bower_components/lodash/dist/lodash',
		'marionette'			: '../bower_components/marionette/lib/core/backbone.marionette',
		'backbone.babysitter'	: '../bower_components/backbone.babysitter/lib/backbone.babysitter',
		'backbone.wreqr'		: '../bower_components/backbone.wreqr/lib/backbone.wreqr',
		'bootstrap'				: '../bower_components/components-bootstrap/js/bootstrap',
		'handlebars'			: '../bower_components/handlebars/handlebars',
		'datepicker'			: '../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker',
		'select2'		    	: '../bower_components/select2/dist/js/select2.full'
	},
	shim : {
		jquery : {
			exports : 'jQuery'
		},
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ['jquery', 'underscore'],
			exports : 'Backbone'
		},
		marionette : {
			deps : ['jquery', 'underscore', 'backbone'],
			exports : 'Marionette'
		},
		bootstrap : {
			deps : ['jquery']
		},
        datepicker : {
			deps : ['jquery', 'bootstrap']
		},
		app : {
			deps : ['jquery', 'underscore', 'backbone', 'marionette']
		},
		router : {
			deps : ['app']
		},
		templates : {
			deps : ['handlebars']
        },
        select2 : {
            deps : ['jquery', 'bootstrap']
        }

		}
});

require([
	"jquery",
	"backbone",
	"underscore",
	"marionette",
	"app",
	"router",
	"templates",
	"handlebars",
	"bootstrap",
	"datepicker",
	"select2"
],
function(jquery, backbone, underscore, marionette, app, router) {
	app.router = new router();

    Backbone.history.start({ pushState: true });
});
