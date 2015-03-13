define([],
    function () {
        chooseFormModel = Backbone.Model.extend({
            urlRoot: 'http://localhost:9001/form/3s2'
        });

        return Form;
    });