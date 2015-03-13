define([],
    function () {

        selectComponentForm = Backbone.Marionette.ItemView.extend({
            className   : "select-component",
            events: {
                'click [data-action="addTextfield"]': 'addTextfield',
                'click [data-action="addDate"]': 'addDate',
                'click [data-action="addCheckbox"]': 'addCheckbox',
                'click [data-action="addRadio"]': 'addRadio'
            },
            template: "app/templates/select-component.hbs",
            initialize: function () {
            },
            onRender: function () {
                this.$el.find('.form-control').datepicker({
                    todayBtn: "linked",
                    orientation: "top auto"
                });
                this.$el.find('[data-toggle="tooltip"]').tooltip();
                //console.log(this);
            },
            addFieldSelectied: function(){
                var $body = this.options.$body;
                $body.find('.new-panel-example .panel-body .well').removeClass('hide');
            },
            addTextfield: function(){
                var $body = this.options.$body;
                this.addFieldSelectied();

                $body.find('.example-inner').append('<input type="text" class="form-control textFieldName" placeholder="Введите название поля">');
                console.log(this);
            }
        });

        return selectComponentForm;
    });