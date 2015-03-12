define(['views/form_view'],
function(formView) {
	var app = {}, Layout = {}, JST = window.JST = window.JST || {};

	app = new Backbone.Marionette.Application();
	Backbone.Marionette.Renderer.render = function(template, data){
		if (!JST[template]) throw "Template '" + template + "' not found!";
		return JST[template](data);
	};
	
	Layout = Backbone.Marionette.LayoutView.extend({
				el : '#main',
				template: "app/templates/main-layout.hbs"
			});

	layout = new Layout();
	
	layout.render();
    var form = formView.render();
    layout.$el.find('.main-wrapper').append(form.$el)

    console.log();
	return app;
});