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
                this.isFormEmpty();
            },
            onRender: function () {
                this.$el.find('.form-control').datepicker({
                    todayBtn: "linked",
                    orientation: "top auto"
                });
                this.$el.find('[data-toggle="tooltip"]').tooltip();
                //console.log(this);
            },
            addFieldSelected: function(e){
                var $body = this.options.$body,
                    $footer = this.options.$footer;
                $footer.find('button').each(function(){
                    $( this ).addClass('disabled');
                });
                var header = '';
                switch (this.type) {
                    case 'textfield': header ='Добавить текстовое поле';
                        break;
                    case 'date': header ='Добавить календарь';
                        break;
                    case 'select': header ='Добавить выпадающий список';
                        break;
                    case 'checkbox': header ='Добавить флажок';
                        break;
                    case 'radio': header ='Добавить переключатель';
                        break;
                }
                if($(e.target).parent().hasClass('btn')){
                    $(e.target).parent().addClass('btn-warning');
                } else{
                    $(e.target).addClass('btn-warning');
                };

                $body.find('.new-panel-example .panel-body .well').removeClass('hide');
                $body.find('.new-panel-example .example-type-name').html(header);
                $body.find('.add-fields-button-group button').each(function() {
                    $( this ).addClass( "disabled" );
                });

                $body.find('.newElementWrapper ').each(function() {
                    $( this ).addClass( "shaded" );
                });



                $body.find('.new-panel-example .textFieldName').focus();

                this.isFormEmpty();
            },
            addTextfield: function(e){
                var $body = this.options.$body;
                this.type='textfield';
                $body.find('.example-inner').append('<label for=""> Название поля </label><input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
                this.turnOnSizeRadio(true);
                this.addFieldSelected(e);
            },
            addDate: function(e){
                var $body = this.options.$body;
                this.type='date';
                $body.find('.example-inner').append('<label for=""> Название поля </label><input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
                this.turnOnSizeRadio(true);
                this.addFieldSelected(e);

            },
            addSelect: function(e){
                var $body = this.options.$body;
                this.type='select';
                var addExtendedField = new addFieldExtendedView({fieldType:this.type});
                $body.find('.example-inner').append(addExtendedField.render().$el);
                this.turnOnSizeRadio(true);
                this.addFieldSelected(e);
            },
            addCheckbox: function(e){
                var $body = this.options.$body;
                this.type='checkbox';
                $body.find('.example-inner').append('<label for=""> Название поля </label><input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
                this.turnOnSizeRadio(false);
                this.addFieldSelected(e);
            },
            addRadio: function(e){
                var $body = this.options.$body;
                this.type='radio';
                var addExtendedField = new addFieldExtendedView({fieldType:this.type});
                $body.find('.example-inner').append(addExtendedField.render().$el);
                this.addFieldSelected(e);
                this.turnOnSizeRadio(false);
            },
            addNewField: function(){
                var $body = this.options.$body,
                    fieldType = this.type,
                    fieldName = this.$el.find('.textFieldName').val(),
                    fieldSize = fieldName.length<22 ? this.$el.find('.sizeRadioButtons input:radio:checked').val() : 'col-md-12',
                    optionsNames = [],
                    that=this;

                if(fieldType=='checkbox'){
                    fieldSize = fieldName.length<22 ? 'col-md-6' : 'col-md-12';
                } else if(fieldType=='radio'){
                    fieldSize = 'col-md-6';
                }

                this.$el.find('.list-group-item').each(function(){
                    optionsNames.push($( this ).attr('value'));
                });
                var isExtended = ((fieldType=='radio'||fieldType=='select')&&optionsNames.length<2)?true:false;

                if(fieldName!==''&&!isExtended){
                    var newField = new addedFieldView({
                        fieldType: fieldType,
                        fieldSize: fieldSize||'col-md-6',
                        optionsNames: optionsNames,
                        fieldName: fieldName
                    });
                    newField.render();
                    newField.$el.find('.newFieldName').html(fieldName);
                    newField.on('removed',function(){
                        that.isFormEmpty();
                    });
                    $body.find('.new-panel-example .panel-body').append(newField.$el);



                    this.cancelNewField();
                }

            },
            cancelNewField: function(){
                var $body = this.options.$body,
                    $footer = this.options.$footer;

                $body.find('.new-panel-example .panel-body .well').addClass('hide');
                $body.find('.add-fields-button-group button').each(function() {
                    $( this ).removeClass( "disabled" ).removeClass('btn-warning');
                });
                $body.find('.newElementWrapper ').each(function() {
                    $( this ).removeClass( "shaded" );
                });

                $footer.find('button').each(function(){
                    $( this ).removeClass('disabled');
                });
                $body.find('.example-inner').empty();
                this.isFormEmpty();
            },
            isFormEmpty: function(){
                var $footer = this.options.$footer;
                if(!this.$el.find('.newElementWrapper').length){
                    $footer.find('[data-action="Save"]').addClass('disabled')
                }
            },
            turnOnSizeRadio: function(turnOn){
                if(turnOn){
                    this.$el.find('.sizeRadioButtons').show();
                } else {
                    this.$el.find('.sizeRadioButtons').hide();
                }
            }
        });

        return selectComponentForm;
    });