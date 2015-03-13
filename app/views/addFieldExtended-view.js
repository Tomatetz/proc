define([],
    function () {

        addFieldExtended = Backbone.Marionette.ItemView.extend({
            events: {
                'click .addOption': 'addOption'
            },
            template: "app/templates/extended-field.hbs",
            initialize: function () {
                //this.template = "app/templates/extended-field.hbs";
            },
            onRender: function () {

            },
            addOption: function(){
                var fieldType = this.options.fieldType,
                    $newOption = this.$el.find('.selectOptionInput'),
                    optionName = $newOption.find('.optionName').val();

                $newOption.find('.optionName').val('');

                this.$el.parent().find('.selectOptionInput').append(
                '<li class="list-group-item">'+optionName+'<button type="button" class="btn btn-warning btn-sm pull-right">-</button></li>');
                //if()
            }
        });

        return addFieldExtended;
    });