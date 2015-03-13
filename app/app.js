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
    //var form = formView.render();
    //layout.$el.find('.main-wrapper').append(form.$el);

    var Forms = Backbone.Model.extend({
        urlRoot: 'http://localhost:9001/form/3s2'
    });
    var forms = new Forms();

    $.when(forms.fetch()).then(
        function (status) {
            //console.log(forms, status);

            var formView1 = new formView({
                model: forms,
                header: 'Выберите действие'
            });
            var form = formView1.render();
            layout.$el.find('.main-wrapper').append(form.$el);
            /*form.$el.find('.btn').on('click', function(){

                forms.fetch();
            });*/
        });

    return app;
});