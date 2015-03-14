define([],
    function () {

        editFieldButtons = Backbone.Marionette.ItemView.extend({
            template: "app/templates/edit-field-buttons.hbs",
            events: {
            },
            initialize: function () {
            },
            onRender: function () {
                //$('[data-toggle="tooltip"]').tooltip();
            }
        });

        return editFieldButtons;
    });