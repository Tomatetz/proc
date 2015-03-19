define([],
    function () {

        dataJSON = Backbone.Model.extend({
            urlRoot: function(){
                return 'http://localhost:9001/saveData'
            },
            initialize: function (attrs, options) {
                console.log(this);
                this.options = options;
            }
        });

        return dataJSON;
    });