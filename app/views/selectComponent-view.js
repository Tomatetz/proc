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
                'click [data-action="cancelNewField"]': 'cancelNewField',/*
                'click [ data-action="moveFieldUp"]': 'moveFieldUp',*/
                'click .newEl': 'newElClicked'
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
                var addExtendedField = new addFieldExtendedView({
                    fieldType:this.type,
                    $body: $body
                });
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
                var addExtendedField = new addFieldExtendedView({
                    fieldType:this.type,
                    $body: $body
                });
                $body.find('.example-inner').append(addExtendedField.render().$el);

                this.addFieldSelected(e);
                this.turnOnSizeRadio(false);
            },
            addNewField: function(){
                var $body = this.options.$body,
                    fieldType = this.type,
                    fieldName = this.$el.find('.textFieldName').val(),
                    fieldSize = fieldName.length<18 ? this.$el.find('.sizeRadioButtons input:radio:checked').val() : 'col-md-12',
                    optionsNames = [],
                    that=this;

                if(fieldType === 'checkbox'||fieldType === 'radio'){
                    fieldSize = fieldName.length<18 ? 'col-md-6' : 'col-md-12';
                }

                this.$el.find('.list-group-item').each(function(){
                    optionsNames.push($( this ).attr('value'));
                });
                var isExtended = ((fieldType=='radio'||fieldType=='select')&&optionsNames.length<2)?true:false;

                if(fieldName!==''&&!isExtended){

                    var newField = this.makeNewField(fieldType, fieldSize, optionsNames, fieldName);

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
            },
            moveField: function(field){
                var element = field[0],
                    direction = field[1];

                var index = this.$el.find('.newEl').index(element);
                var fieldType = element.find('.newElementWrapper').attr('fieldtype'),
                    fieldName = fieldType =='checkbox' ?
                        element.find('[name="newCheckboxField"]').attr('value') : element.find('.newFieldName').html(),
                    fieldSize = element.find('.newElementWrapper').attr('fieldsize'),
                    optionsNames = [];
                var newField = this.makeNewField(fieldType, fieldSize, null, fieldName);

                //console.log(fieldType, fieldSize, null, fieldName);
                if(direction === 'Up'){
                    if(index!==0){
                        $( this.$el.find('.newEl')[index-1] ).before(newField.$el);
                        element.remove();
                    }
                } else if(direction === 'Down'){
                    if(index!==this.$el.find('.newEl').length-1){
                        $( this.$el.find('.newEl')[index+1] ).after(newField.$el);
                        element.remove();
                    }
                }
            },
            makeNewField: function(fieldType, fieldSize, optionsNames, fieldName){
                var $body = this.options.$body;
                var that = this;

                var newField = new addedFieldView({
                    fieldType: fieldType,
                    fieldSize: fieldSize||'col-md-6',
                    optionsNames: optionsNames,
                    fieldName: fieldName
                });

                //console.log('!!!CALLBACK fieldType:'+fieldType, ' fieldSize:'+fieldSize, ' optionsNames:'+optionsNames, ' fieldName:'+fieldName);
                newField.render();
                newField.$el.find('.newFieldName').html(fieldName);
                newField.on('removed',function(){
                    that.isFormEmpty();
                });
                newField.on('moved',function(field){
                    that.moveField(field);
                });
                return newField
            }
            /*,
            newElClicked: function(e){
                console.log($(e.currentTarget));
                $( "div" ).index( this );
                if($(e.target).hasClass('moveField')){
                    console.log($(e.target).data());
                } else if($(e.target).hasClass('moveFieldIcon')){
                    console.log($(e.target).parent().data().action);
                }
            }*/
        });

        return selectComponentForm;
    });