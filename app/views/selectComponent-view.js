define(['views/addedField-view', 'views/addFieldExtended-view'],
    function (addedFieldView, addFieldExtendedView) {

        selectComponentForm = Backbone.Marionette.ItemView.extend({
            className   : "select-component",
            events: {
                'click [data-action="addTextfield"]': 'addTextfield',
                'click [data-action="addDate"]': 'addDate',
                'click [data-action="addSelect"]': 'addSelect',
                'click [data-action="addCheckbox"]': 'addCheckbox',
                'click [data-action="addRadio"]': 'addRadio',
                'click [data-action="addNewField"]': 'addNewField',
                'click [data-action="cancelNewField"]': 'cancelNewField'
            },
            template: "app/templates/select-component.hbs",
            initialize: function () {
                this.type = "";
            },
            onRender: function () {
                this.$el.find('.form-control').datepicker({
                    todayBtn: "linked",
                    orientation: "top auto"
                });
                this.$el.find('[data-toggle="tooltip"]').tooltip();
                //console.log(this);
            },
            addFieldSelected: function(){
                var $body = this.options.$body;
                $body.find('.new-panel-example .panel-body .well').removeClass('hide');
                $body.find('.add-fields-button-group button').each(function() {
                    $( this ).addClass( "disabled" );
                });
            },
            addTextfield: function(){
                var $body = this.options.$body;
                this.addFieldSelected();
                this.type='textfield';
                $body.find('.example-inner').append('<label for=""> Название поля </label><input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
            },
            addDate: function(){
                this.addTextfield();
                this.type='date';
            },
            addSelect: function(){
                var $body = this.options.$body;
                this.addFieldSelected();
                this.type='select';
                var addExtendedField = new addFieldExtendedView({fieldType:this.type});
                $body.find('.example-inner').append(addExtendedField.render().$el);
            },
            addCheckbox: function(){
                var $body = this.options.$body;
                this.addFieldSelected();
                this.type='checkbox';
                var addExtendedField = new addFieldExtendedView({fieldType:this.type});
                $body.find('.example-inner').append(addExtendedField.render().$el);
            },
            addNewField: function(){
                var $body = this.options.$body,
                    fieldType = this.type,
                    fieldName = this.$el.find('.textFieldName').val(),
                    fieldSize = this.$el.find('.sizeRadioButtons input:radio:checked').val(),
                    optionsNames = [];

                this.$el.find('.list-group-item').each(function(){
                    optionsNames.push($( this ).attr('value'));
                });
                var isExtended = ((fieldType=='checkbox'||fieldType=='radio'||fieldType=='select')&&optionsNames.length==0)?true:false;

                if(fieldName!==''&&!isExtended){
                    var newField = new addedFieldView({
                        fieldType: fieldType,
                        fieldSize: fieldSize||'col-md-6',
                        optionsNames: optionsNames
                    });
                    newField.render();
                    newField.$el.find('.newFieldName').html(fieldName)
                    $body.find('.new-panel-example .panel-body').append(newField.$el);

                    this.cancelNewField();
                }

            },
            cancelNewField: function(){
                var $body = this.options.$body;
                $body.find('.new-panel-example .panel-body .well').addClass('hide');
                $body.find('.add-fields-button-group button').each(function() {
                    $( this ).removeClass( "disabled" );
                });
                $body.find('.example-inner').empty();
            }
        });

        return selectComponentForm;
    });