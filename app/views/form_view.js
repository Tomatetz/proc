define(['views/selectComponent-view'],
    function (selectComponentView) {

        var Form = Backbone.Marionette.ItemView.extend({
            events: {
                'click [data-action="ChooseForm"]': 'ChooseForm',
                'click [data-action="EditForm"]': 'EditForm',
                'click [data-action="CreateForm"]': 'CreateForm',
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
                                options.push($( this ).val())
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
                    //$header.css('backgroundColor',color);
                }

                $body.find('.menuButtons').toggleClass('hide');
                $footer.toggleClass('hide');

            },
            ChooseForm: function (e) {
                var buttonColor = '#B3E2B3';
                this.buttonClicked(buttonColor,e);
                this.addSelectForm();
            },
            EditForm: function (e) {
                var buttonColor = '#E4D2BA';
                this.buttonClicked(buttonColor,e);
            },
            CreateForm: function (e) {
                var $body = this.$el.find('.menu-body'),
                    $footer = this.$el.find('.menu-footer');
                var buttonColor = '#C8E1E8';
                this.buttonClicked(buttonColor,e);

                var selectComponent = new selectComponentView({
                    $body:$body,
                    $footer:$footer
                });
                selectComponent.render();
                $body.append(selectComponent.$el)
            },
            addSelectForm: function(){
                var $body = this.$el.find('.menu-body');
                $body.append('<select class="form-control formsCollecion"></select>');
                var forms = this.model.get('forms');
                _.each(forms, function(form){
                    $body.find('.formsCollecion').append('<option>'+form.name+'</option>');

                    console.log(form);
                });

            }
        });

        return Form;
    });