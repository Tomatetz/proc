define(['views/selectComponent-view','views/getFormData'],
    function (selectComponentView, getFormData) {

        var Form = Backbone.Marionette.ItemView.extend({
            events: {
                'click [data-action="ChooseForm"]': 'ChooseForm',
                'click [data-action="CreateForm"]': 'CreateForm',
                'click [data-action="UseForm"]': 'UseForm',
                'click [data-action="EditLoadedForm"]': 'EditLoadedForm',
                'click [data-action="CancelEditForm"]': 'CancelEditForm',
                'click [data-action="Back"]': 'buttonClicked',
                'click [data-action="Save"]': 'saveForm',
                'click [data-action="SaveEditedForm"]': 'SaveEditedForm',
                'click [data-action="DeleteEditedForm"]': 'DeleteEditedForm',
                'click [data-action="DeleteFormConfirm"]': 'DeleteFormConfirm',
                'click [data-action="DeleteFormRefuse"]': 'DeleteFormRefuse',
                'click [data-action="SaveFormData"]': 'SaveFormData'
            },
            template: "app/templates/form.hbs",
            initialize: function () {
                this.model.on('change', this.render, this);
            },
            onRender: function () {
                this.$el.find('.calendar').datepicker({
                    todayBtn: "linked",
                    orientation: "top auto"
                });
                //console.log(this);
            },
            saveForm: function(edited){

                var that=this;
                if(edited=='edited'){
                    var name = that.$el.find('.edit-form-name input').val();
                } else {
                    var name = that.$el.find('.new-form-name__input').val();
                }
                var parseForm = {
                    name: name,
                    form: [],
                    action: 'edit'
                };
                this.$el.find('.newElementWrapper').each(function(){
                    var fieldType= $( this ).attr('fieldType');
                    var $element = $( this );
                    function getOptions(){
                        if(fieldType === 'radio' || fieldType === 'select'){
                            var options = [];

                            $element.find('.newSelect option').each(function(){
                                if($( this ).val()!==""){
                                    options.push($( this ).val());
                                }
                            });
                            $element.find('[name="newRadioField"]').each(function(){
                                options.push($( this ).attr('value'));
                            });
                            return options;
                        }
                    };


                    parseForm.form.push({
                            fieldType: fieldType,
                            fieldName: fieldType == 'checkbox' ?
                                that.$el.find('[name="newCheckboxField"]').attr('value') : $element.find('.newFieldName').html(),
                            fieldSize: $(this).attr('fieldSize'),
                            fieldOptions: getOptions() || null
                    });
                });
                console.log(JSON.stringify(parseForm));

                if(name!=='') {
                    this.model.save(parseForm, {
                        success: function (model, response) {
                            console.log("success");
                            that.model.fetch()
                        }
                    })
                } else {
                    that.$el.find('.new-form-name__input').css('border','1px solid red')
                }


            },
            buttonClicked: function(color, e){
                var $header = this.$el.find('.menu-header'),
                    $body = this.$el.find('.menu-body'),
                    $footer = this.$el.find('.menu-footer');

                var isBackClicked = e ? false : true;

                if(isBackClicked){
                    $body.find('.formsCollecion').remove();
                    $body.find('.select-component').remove();
                    $header.find('#myModalLabel').html('Выберите действие');
                } else {
                    var buttonText = e.target.innerHTML;
                    $header.find('#myModalLabel').html(buttonText);
                }

                $body.find('.menuButtons').toggleClass('hide');
                $footer.toggleClass('hide');

                this.$el.find('[data-action="SaveFormData"]').hide();

            },
            ChooseForm: function (e) {
                var buttonColor = '#B3E2B3';
                this.buttonClicked(buttonColor,e);
                this.addSelectForm();
            },
            CreateForm: function (e) {
                var that = this;
                var $body = this.$el.find('.menu-body'),
                    $footer = this.$el.find('.menu-footer');
                var buttonColor = '#C8E1E8';

                this.buttonClicked(buttonColor,e);
                this.$el.find('[data-action="Save"]').show();
                this.$el.find('.update-form-buttons').hide();
                
                that.toggleShowingUseFormButtons('show', $body, that);
                var selectComponent = new selectComponentView({
                    $body:$body,
                    $footer:$footer
                });
                selectComponent.render();
                $body.append(selectComponent.$el)

                selectComponent.$el.find('.new-form-name__input').focus();
            },
            addSelectForm: function(){
                var that = this;
                var $body = this.$el.find('.menu-body');
                this.$el.find('[data-action="Save"]').hide();

                this.$el.find('.loadedFormActions').hide();
                this.$el.find('.update-form-buttons').hide();

                $body.append('<select class="form-control formsCollecion"><option></option></select>');

                var forms = this.model.get('forms');
                _.each(forms, function(form){
                    $body.find('.formsCollecion').append('<option>'+form.name+'</option>');
                });

                $body.find('.formsCollecion').change(function (){
                    $body.find('.select-component').remove();
                    var name = $body.find('select option:selected').html();
                    that.name = name;

                    _.each(forms, function(form){
                        if(form.name == name){

                            var $body = that.$el.find('.menu-body'),
                                $footer = that.$el.find('.menu-footer'),
                                form = form || null;

                            var selectComponent = new selectComponentView({
                                $body:$body,
                                $footer:$footer,
                                form: form
                            });
                            selectComponent.render();
                            selectComponent.$el.find('.edit-buttons-wrapper').hide();

                            $body.append(selectComponent.$el)
                        }
                    });
                    that.toggleShowingUseFormButtons('hide', $body, that, name);
                });
            },
            UseForm: function(){
                var $body = this.$el.find('.menu-body');
                this.toggleShowingUseFormButtons('hide', $body, this, '');
                $body.find('.newElementWrapper ').removeClass( "shaded" );
                this.$el.find('.formsCollecion').hide();
                this.$el.find('[data-action="SaveFormData"]').show();
                this.$el.find('[data-action="SaveFormData"] .editedFormName').html(this.name);
                this.$el.find('#myModalLabel').html(this.name);
            },
            SaveFormData: function(){
                var name = this.name;

                var parsedData = this.ParseFormData();
                var newFormModel = new getFormData();
                newFormModel.save({
                    name: name,
                    data: parsedData
                });
            },
            ParseFormData: function(form){
                var parsedData = [];
                this.$el.find('.newElementWrapper').each(function(){
                    var type = $( this ).attr('fieldtype');
                    var value, name;
                    if(type == 'date'){
                        value = $(this).find('.calendar').val();
                        name = $(this).find('.newFieldName').html();
                    } else if(type == 'textfield'){
                        value = $(this).find('input').val();
                        name = $(this).find('.newFieldName').html();
                    } else if(type == 'checkbox'){
                        value = $(this).find('[name="newCheckboxField"]').is(':checked');
                        name = $(this).find('input').attr('value');
                    }
                    parsedData.push({
                        name: name,
                        value: value
                    });
                });
                console.log(parsedData);

                return parsedData;
            },
            EditLoadedForm: function(a){
                if(a=='cancelEditing'){

                    this.$el.find('.newElementWrapper ').each(function() {
                        $( this ).addClass( "shaded" );
                    });
                    this.$el.find('.add-fields-button-group button').fadeOut(400);
                    this.$el.find('.edit-buttons-wrapper').hide();
                    this.$el.find('.update-form-buttons').hide();
                    this.$el.find('.loadedFormActions').show();
                    this.$el.find('.formsCollecion').show();
                    this.$el.find('.edit-form-name').hide();
                } else {
                    this.$el.find('.newElementWrapper ').each(function() {
                        $( this ).removeClass( "shaded" );
                    });
                    this.$el.find('.add-fields-button-group button').fadeIn(400);
                    this.$el.find('.edit-buttons-wrapper').fadeIn(400);
                    this.$el.find('.update-form-buttons').show();
                    this.$el.find('.loadedFormActions').hide();
                    this.$el.find('.formsCollecion').hide();
                    this.$el.find('.edit-form-name').show();

                    this.$el.find('.edit-form-name input').val(this.name);

                }
            },
            CancelEditForm: function(){
                this.EditLoadedForm('cancelEditing');
            },
            toggleShowingUseFormButtons: function(val, $body, that, name){
                if(val == 'hide'){
                    $body.find('.newElementWrapper ').each(function() {
                        $( this ).addClass( "shaded" );
                    });

                    $body.find('.add-fields-button-group button').hide();
                    $body.find('.new-panel-example .panel-heading').hide();
                    if(name!==''){
                        that.$el.find('.loadedFormActions').show();
                    } else {
                        that.$el.find('.loadedFormActions').hide();
                    }
                } else if(val == 'show'){
                    this.$el.find('.loadedFormActions').hide();
                    $body.find('.add-fields-button-group button').show();
                    $body.find('.new-panel-example .panel-heading').show();
                }

            },
            SaveEditedForm: function(){
                this.saveForm('edited');
            },
            DeleteEditedForm: function(){
                var $body = this.$el.find('.menu-body');

                this.$el.find('.edit-form-name input').val(this.name);
                this.toggleShowingUseFormButtons('hide',$body,this, '');
                this.$el.find('.delete-form-alert').show();
                this.$el.find('.update-form-buttons').addClass('disabled');
                this.$el.find('[data-action="Back"]').addClass('disabled');

                this.$el.find('.editedFormName').html(this.name);
            },
            DeleteFormRefuse: function(){
                var $body = this.$el.find('.menu-body');

                this.toggleShowingUseFormButtons('show',$body,this);
                $body.find('.newElementWrapper ').removeClass( "shaded" );
                this.$el.find('.delete-form-alert').hide();
                this.$el.find('.update-form-buttons').removeClass('disabled');
                this.$el.find('[data-action="Back"]').removeClass('disabled');

                this.$el.find('.editedFormName').html('');
            },
            DeleteFormConfirm: function(){
                var that = this;
                _.each(this.model.get('forms'), function(form){
                    if(form.name == that.name){
                        form.action = 'delete';
                        that.model.save(form, {
                            success: function (model, response) {
                                console.log("success");
                                that.model.fetch()
                            }
                        })
                    }
                });
                this.DeleteFormRefuse();
            }

        });

        return Form;
    });