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
                } else if(fieldType==='checkbox'){
                    _.each(options, function(option){
                        console.log(option);
                        that.$el.find('.checkbox-group').append('<div class="checkbox"><label><input type="checkbox" value="">'+option+'</label></div>')
                        //that.$el.find('.checkbox').append('<input type="checkbox" value="'+option+'"><label for="CheckboxData1" class="itemLabel">'+option+'</label>')
                    });
                }
            }
        });

        return addedField;
    });