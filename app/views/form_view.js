define([],
    function() {
        Form = Backbone.Marionette.ItemView.extend({
            el : '#main',
            template: "app/templates/form.hbs",
            onRender:function(){
                this.$el.find('.form-control').datepicker({});
            }
        });

        var formView = new Form();
        return formView;
    });