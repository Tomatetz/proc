define(['views/editFieldButtons-view'],
    function (editFieldButtonsView) {

        addedField = Backbone.Marionette.ItemView.extend({
            className : 'newEl',
            events: {
                'click [ data-action="moveFieldUp"]': 'moveFieldUp',
                'click [ data-action="moveFieldDown"]': 'moveFieldDown',
                'click [ data-action="editField"]': 'editField',
                'click [ data-action="removeField"]': 'removeField'
            },
            initialize: function () {
                var fieldType = this.options.fieldType;
                this.template = "app/templates/new-field-"+fieldType+".hbs";
            },
            onRender: function () {
                var that = this;
                var fieldType = this.options.fieldType,
                    options = this.options.optionsNames,
                    fieldName = this.options.fieldName,
                    fieldSize = this.options.fieldSize;

                var editField = new editFieldButtonsView({
                });
                editField.render();

                this.$el.find('.edit-buttons-wrapper').append(editField.$el);

                this.$el.find('.newElementWrapper').addClass(fieldSize)
                    .attr('fieldSize', fieldSize)
                    .attr('fieldType', fieldType);


                if(fieldType==='date'){
                    this.$el.find('input').datepicker({
                        format: "dd/mm/yyyy",
                        todayBtn: "linked",
                        orientation: "auto right"
                    });
                } else if(fieldType==='select'){
                    _.each(options, function(option){
                        that.$el.find('.newSelect').append('<option class="addedOption">'+option+'</option>')
                    });
                } else if(fieldType==='radio'){
                    _.each(options, function(option){
                        that.$el.find('.radio-group').append('<div class="radio addedOption"><label><input type="radio" name="newRadioField" value="'+option+'">'+option+'</label></div>');
                    });
                } else if(fieldType==='checkbox'){
                    that.$el.find('.checkbox').append('<label><input type="checkbox" name="newCheckboxField" value="'+fieldName+'">'+fieldName+'</label>');
                }

            },
            moveFieldUp: function(e){
                this.trigger("moved", [this.$el, 'Up']);
            },
            moveFieldDown: function(e){
                this.trigger("moved", [this.$el, 'Down']);
            },
            editField: function(e){
                this.trigger("edit", this.$el);
            },
            removeField: function(e){
                var fieldType = this.options.fieldType;
                this.$el.remove();
                /*if(fieldType==='radio' || fieldType==='select'){
                    $(e.target).parent().parent().parent().parent().parent().parent().remove();
                }*/
                this.trigger("removed");
            }
        });

        return addedField;
    });