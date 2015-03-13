define([],
    function () {

        addedField = Backbone.Marionette.ItemView.extend({
            events: {
                'click [data-action="ChooseForm"]': 'ChooseForm'
            },
            //template: "app/templates/new-field-textField.hbs",
            initialize: function () {
                var fieldType = this.options.fieldType;
                console.log(this);
                this.template = "app/templates/new-field-"+fieldType+".hbs";
            },
            onRender: function () {{
                var fieldType = this.options.fieldType;
                this.$el.find('.newElementWrapper').addClass(this.options.fieldSize);
                if(fieldType==='date'){
                    this.$el.find('input').datepicker({
                        format: "dd/mm/yyyy",
                        todayBtn: "linked",
                        orientation: "top auto"
                    });
                }
            }
            }
        });

        return addedField;
    });