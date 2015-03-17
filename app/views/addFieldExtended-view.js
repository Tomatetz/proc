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
                var that = this;
                _.each(this.options.existedOptions, function(option){
                    that.$el.find('.optionsList').append(
                        '<li class="list-group-item" value="'+option+'">'+option+'<button type="button" class="btn btn-danger btn-xs pull-right">-</button></li>');
                })
            },
            addOption: function(){
                var fieldType = this.options.fieldType,
                    $newOption = this.$el.find('.selectOptionInput'),
                    optionName = $newOption.find('.optionName').val();

                $newOption.find('.optionName').val('');

                if(optionName!==''){
                    this.$el.parent().find('.optionsList').append(
                        '<li class="list-group-item" value="'+optionName+'">'+optionName+'<button type="button" class="btn btn-danger btn-xs pull-right">-</button></li>');
                }
            },
            btnDanger:function(e){
                $(e.target).parent().remove();
            }
        });

        return addFieldExtended;
    });