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
                'click [data-action="cancelNewField"]': 'cancelNewField',
                'click .newEl': 'newElClicked'/*,
                'click .saveEditedField': 'saveEditedField'*/
            },
            template: "app/templates/select-component.hbs",
            initialize: function () {
                this.type = "";
                this.isFormEmpty();
            },
            onRender: function () {
                var that = this;
                this.$el.find('.form-control').datepicker({
                    todayBtn: "linked",
                    orientation: "top auto"
                });
                this.$el.find('[data-toggle="tooltip"]').tooltip();
                if(this.options.form){
                    _.each(this.options.form.form, function(form){
                        var fieldType = form.fieldType,
                            fieldSize = form.fieldSize,
                            fieldName = form.fieldName,
                            optionsNames = form.fieldOptions;

                        var newField = that.makeNewField(fieldType, fieldSize, optionsNames, fieldName);
                        
                        that.$el.find('.well').parent().append(newField.$el);
                    });
                }
            },
            addFieldSelected: function(e){
                var $body = this.options.$body,
                    $footer = this.options.$footer;
                $footer.find('button').each(function(){
                    $( this ).addClass('disabled');
                });
                var header = '';

                this.$el.find('[data-action="saveEditedField"]').html('Добавить')
                    .attr('data-action', 'addNewField');

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
                $body.find('.example-inner').html('')
                    .append('<label for=""> Название поля </label><input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
                this.turnOnSizeRadio(true);
                this.addFieldSelected(e);
            },
            addDate: function(e){
                var $body = this.options.$body;
                this.type='date';
                $body.find('.example-inner').html('')
                    .append('<label for=""> Название поля </label><input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
                this.turnOnSizeRadio(true);
                this.addFieldSelected(e);

            },
            addSelect: function(e, optionsNames){
                var $body = this.options.$body;
                this.type='select';
                var existedOptions = optionsNames||null;

                var addExtendedField = new addFieldExtendedView({
                    fieldType:this.type,
                    $body: $body,
                    existedOptions: existedOptions
                });
                $body.find('.example-inner').html('')
                    .append(addExtendedField.render().$el);
                this.turnOnSizeRadio(true);
                this.addFieldSelected(e);
            },
            addCheckbox: function(e){
                var $body = this.options.$body;
                this.type='checkbox';
                $body.find('.example-inner').html('')
                    .append('<label for=""> Название поля </label><input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
                this.turnOnSizeRadio(false);
                this.addFieldSelected(e);
            },
            addRadio: function(e, optionsNames){
                var $body = this.options.$body;
                this.type='radio';
                var existedOptions = optionsNames||null;
                var addExtendedField = new addFieldExtendedView({
                    fieldType:this.type,
                    $body: $body,
                    existedOptions: existedOptions
                });
                $body.find('.example-inner').html('')
                    .append(addExtendedField.render().$el);
                this.addFieldSelected(e);
                this.turnOnSizeRadio(false);
            },
            addNewField: function(){
                var $body = this.options.$body,
                    fieldType = this.type,
                    fieldName = this.$el.find('.textFieldName').val()||'';
                    var fieldSize = fieldName.length<18 ? this.$el.find('.sizeRadioButtons input:radio:checked').val() : 'col-md-12',
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

                $body.find('.example-inner').html('');
                this.$el.find('.editing').removeClass('editing');
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

                if(fieldType === 'select'){
                    element.find('.newSelect option').each(function(){
                        if($( this ).html()!==''){
                            optionsNames.push($( this ).html());
                        }
                    })
                } else if(fieldType === 'radio'){
                    element.find('[name="newRadioField"]').each(function(){
                        optionsNames.push($( this ).attr('value'));
                    })
                }

                var options = optionsNames.length==0 ? null:optionsNames;

                var newField = this.makeNewField(fieldType, fieldSize, options, fieldName);

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

                newField.render();
                newField.$el.find('.newFieldName').html(fieldName);
                newField.on('removed',function(){
                    that.isFormEmpty();
                });
                newField.on('moved',function(field){
                    that.moveField(field);
                });
                newField.on('edit',function(field){
                    that.editField(field, fieldType);
                });
                return newField
            },
            editField: function(field, fieldType){
                var that = this;
                var optionsNames = [];
                var fieldType = field.find('.newElementWrapper').attr('fieldtype');

                field.addClass('editing');
                if(fieldType == 'textfield'){

                    var button = this.$el.find('[data-action="addTextfield"]');
                    this.addTextfield(button);

                } else if(fieldType == 'date'){

                    var button = this.$el.find('[data-action="addDatefield"]');
                    this.addDate(button);

                } else if(fieldType == 'checkbox'){

                    var button = this.$el.find('[data-action="addCheckbox"]');
                    this.addCheckbox(button);

                } else if(fieldType == 'select'){

                    var button = this.$el.find('[data-action="addSelect"]');
                    that.$el.find('.editing .newSelect option').each(function(){
                        if($( this ).html()!==''){
                            optionsNames.push($( this ).html());
                        }
                    });
                    this.addSelect(button, optionsNames);

                } else if(fieldType == 'radio'){

                    var button = this.$el.find('[data-action="addRadio"]');
                    that.$el.find('.editing [name="newRadioField"]').each(function(){
                        optionsNames.push($( this ).attr('value'));
                    });
                    this.addRadio(button, optionsNames);
                }


                var fieldName = fieldType =='checkbox' ?
                    field.find('[name="newCheckboxField"]').attr('value') : field.find('.newFieldName').html();

                this.$el.find('.textFieldName').val(fieldName);

                this.$el.find('[data-action="addNewField"]').html('Сохранить изменения')
                    .attr('data-action', 'saveEditedField').on('click', function(){
                        var newName = that.$el.find('.textFieldName').val();
                        that.saveEditedField(field, fieldType, newName)
                });

            },
            saveEditedField: function(field, fieldType, fieldName){
                var that = this;
                var fieldType = this.$el.find('.editing .newElementWrapper').attr('fieldtype')
                var fieldSize = fieldName.length<18 ? this.$el.find('.sizeRadioButtons input:radio:checked').val() : 'col-md-12',
                    optionsNames = [];
                this.$el.find('.editing .newFieldName').html(fieldName);
                if(fieldType === 'checkbox'){
                    this.$el.find('.editing .checkbox label').html('<input type="checkbox" name="newCheckboxField" value="'+fieldName+'">'+fieldName);
                }

                if(fieldType === 'checkbox'||fieldType === 'radio'){
                    fieldSize = fieldName.length<18 ? 'col-md-6' : 'col-md-12';
                }

                var fieldsizeOld = this.$el.find('.editing .newElementWrapper').attr('fieldsize');
                this.$el.find('.editing .newElementWrapper')
                    .removeClass(fieldsizeOld).addClass(fieldSize).attr('fieldsize', fieldSize);

                this.$el.find('.list-group-item').each(function(){
                    optionsNames.push($( this ).attr('value'));
                });
                that.$el.find('.editing .addedOption').remove();
                if(fieldType==='select'){
                    _.each(optionsNames, function(option){
                        that.$el.find('.editing .newSelect').append('<option class="addedOption">'+option+'</option>')
                    });
                } else if(fieldType==='radio') {
                    _.each(optionsNames, function (option) {
                        that.$el.find('.editing .radio-group').append('<div class="radio addedOption"><label><input type="radio" name="newRadioField" value="' + option + '">' + option + '</label></div>');
                    });
                }
                var isExtended = ((fieldType=='radio'||fieldType=='select')&&optionsNames.length<2)?true:false;

                if(fieldName!==''&&!isExtended){

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
                }


                this.$el.find('.editing').removeClass('editing');

            }
        });

        return selectComponentForm;
    });