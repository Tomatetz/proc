define([],
    function () {

        addFieldExtended = Backbone.Marionette.ItemView.extend({
            events: {
                'click .addOption': 'addOption',
                'click .btn-danger': 'btnDanger'
            },
            template: "app/templates/extended-field.hbs",
            initialize: function () {
            },
            onRender: function () {

            },
            addOption: function(){
                var fieldType = this.options.fieldType,
                    $newOption = this.$el.find('.selectOptionInput'),
                    optionName = $newOption.find('.optionName').val();

                $newOption.find('.optionName').val('');

                if(optionName!==''){
                    this.$el.parent().find('.list-group').append(
                        '<li class="list-group-item">'+optionName+'<button type="button" class="btn btn-danger btn-xs pull-right">-</button></li>');
                }
            },
            btnDanger:function(e){
                $(e.target).parent().remove();
            }
        });

        return addFieldExtended;
    });