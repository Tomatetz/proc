define([],
    function () {

        addedField = Backbone.Marionette.ItemView.extend({
            events: {
                'click [ data-action="removeField"]': 'removeField'
            },
            //template: "app/templates/new-field-textField.hbs",
            initialize: function () {
                var fieldType = this.options.fieldType;
                this.template = "app/templates/new-field-"+fieldType+".hbs";
            },
            onRender: function () {
                var that = this;
                var fieldType = this.options.fieldType;
                var options = this.options.optionsNames;
                var fieldName = this.options.fieldName;

                this.$el.find('.newElementWrapper').addClass(this.options.fieldSize);
                if(fieldType==='date'){
                    this.$el.find('input').datepicker({
                        format: "dd/mm/yyyy",
                        todayBtn: "linked",
                        orientation: "auto right"
                    });
                } else if(fieldType==='select'){
                    _.each(options, function(option){
                        that.$el.find('.newSelect').append('<option>'+option+'</option>')
                    });
                } else if(fieldType==='radio'){
                    _.each(options, function(option){
                        that.$el.find('.radio-group').append('<div class="radio"><label><input type="radio" name="newRadioField" value="'+option+'">'+option+'</label></div>');
                    });
                } else if(fieldType==='checkbox'){
                    that.$el.find('.checkbox').append('<label><input type="checkbox" name="newCheckboxField" value="'+fieldName+'">'+fieldName+'</label>');
                    this.$el.find('.form-group').before('<button type="button" class="btn btn-danger btn-xs pull-right" data-action="removeField">-</button>');
                }
                this.$el.find('.newFieldName').after('<button type="button" class="btn btn-danger btn-xs pull-right" data-action="removeField">-</button>');
            },
            removeField:function(e){
                if(this.options.fieldType==='checkbox'){
                    $(e.target).parent().parent().remove();
                } else{
                    $(e.target).parent().parent().parent().remove();
                }
                this.trigger("removed")
            }
        });

        return addedField;
    });