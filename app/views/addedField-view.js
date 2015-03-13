define([],
    function () {

        addedField = Backbone.Marionette.ItemView.extend({
            events: {
                'click [data-action="ChooseForm"]': 'ChooseForm'
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
                        orientation: "top auto"
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
                }
            }
        });

        return addedField;
    });