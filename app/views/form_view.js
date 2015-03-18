define(['views/selectComponent-view'],
    function (selectComponentView) {

        var Form = Backbone.Marionette.ItemView.extend({
            events: {
                'click [data-action="ChooseForm"]': 'ChooseForm',
                'click [data-action="CreateForm"]': 'CreateForm',
                'click [data-action="UseForm"]': 'UseForm',
                'click [data-action="EditLoadedForm"]': 'EditLoadedForm',
                'click [data-action="CancelEditForm"]': 'CancelEditForm',
                'click [data-action="Back"]': 'buttonClicked',
                'click [data-action="Save"]': 'saveForm'
            },
            template: "app/templates/form.hbs",
            initialize: function () {
                this.model.on('change', this.render, this);
            },
            onRender: function () {
                this.$el.find('.form-control').datepicker({
                    todayBtn: "linked",
                    orientation: "top auto"
                });
                //console.log(this);
            },
            saveForm: function(){
                var that=this;
                var parseForm = [];
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

                    parseForm.push({
                        fieldType: fieldType,
                        fieldName: fieldType =='checkbox' ?
                            that.$el.find('[name="newCheckboxField"]').attr('value') : $element.find('.newFieldName').html(),
                        fieldSize : $( this).attr('fieldSize'),
                        fieldOptions: getOptions() || null
                    });
                });
                console.log(JSON.stringify(parseForm));

                this.model.save(parseForm);
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
                /*this.$el.find('.loadedFormActions').hide();
                $body.find('.add-fields-button-group button').show();
                $body.find('.new-panel-example .panel-heading').show();*/
                that.toggleShowingUseFormButtons('show', $body, that);
                var selectComponent = new selectComponentView({
                    $body:$body,
                    $footer:$footer
                });
                selectComponent.render();
                $body.append(selectComponent.$el)
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

            },
            EditLoadedForm: function(a){
                if(a=='back'){

                    this.$el.find('.newElementWrapper ').each(function() {
                        $( this ).addClass( "shaded" );
                    });
                    this.$el.find('.add-fields-button-group button').hide();
                    this.$el.find('.edit-buttons-wrapper').hide();
                    this.$el.find('.update-form-buttons').hide();
                    this.$el.find('.loadedFormActions').show();
                } else {
                    this.$el.find('.newElementWrapper ').each(function() {
                        $( this ).removeClass( "shaded" );
                    });
                    this.$el.find('.add-fields-button-group button').show();
                    this.$el.find('.edit-buttons-wrapper').show();
                    this.$el.find('.update-form-buttons').show();
                    this.$el.find('.loadedFormActions').hide();
                }
            },
            CancelEditForm: function(){
                this.EditLoadedForm('back');
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

            }

        });

        return Form;
    });