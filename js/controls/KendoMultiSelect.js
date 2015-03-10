/** @jsx React.DOM */
define([
    'underscore', 'underscore.string', 'jquery', 'react',
    'jsx!assets/wingspan-forms/js/ControlCommon',
    'jsx!assets/wingspan-forms/js/ImmutableOptimizations'
], function (_, str, $, React, controlCommon, ImmutableOptimizations) {
    'use strict';

    return React.createClass({
        mixins: [ImmutableOptimizations],

        getDefaultProps: function() {
            return {
                id: _.uniqueId(),
                label: ' ', // will this render as nbsp? No, FIXME
                layout: 'formField',
                disabled: false,
                isValid: [true, ''],
                template: "str.sprintf('${%s} - ${%s}', this.props.valueField, this.props.displayField)",
                onChange: function () {},
                readonly: false,
                noControl: false,
                placeholder: '',
                width: null // use whatever the default is
            };
        },

        componentWillMount: function () {
            console.assert(this.props.displayField);
            console.assert(this.props.valueField);
            console.assert(this.props.dataSource);
        },

        render: function () {

            var classes = _.compact([
                this.props.layout,
                'formFieldMultiselect',
                controlCommon.quadState(this.props.disabled, this.props.readonly, this.props.isValid, this.props.noControl)
            ]).join(' ');

            void classes;
            /*jshint ignore:start */
            var control = (this.props.noControl
                ? (<span data-wspt-id="displayValue">{this.props.value}</span>)
                : (<select id={this.props.id} />));

            return(
                <div className={classes}>
                    <label className="formLabel" htmlFor={this.props.id}>{this.props.label}</label>
                    <div className="formElement">
                        {control}
                    </div>
                </div>
            );
            /*jshint ignore:end */
        },

        getDisplayValue: function () {
            // for displaying as a string in noControl mode
            var displayVals = _.map(this.props.value, function (val) {
                return val[this.props.displayField];
            });

            return str.join(displayVals, ', '); // l10n?
        },

        componentDidMount: function () {

            if (this.props.noControl) {
                // Nothing to do - all done in JSX.
                return;
            }

            var $el = $(this.getDOMNode()).find('#' + this.props.id);

            if (this.props.width) {
                $el.width(340);
            }
            $el.kendoMultiSelect({
                filter: 'contains',
                highlightFirst: false,
                dataTextField: this.props.displayField,
                dataValueField: this.props.valueField,
                dataSource: this.props.dataSource,
                placeholder: this.props.placeholder,
                change: this.onChange
            });
            {/* itemTemplate: this.props.template, */}

            var kendoWidget = $el.data('kendoMultiSelect');

            // the 'value' method is a getter/setter that gets/sets the valueField. It will look up the record
            // in the store via the value set here.
            this.setMultiSelectValue(kendoWidget);

            if (this.props.disabled) {
                // disabled beats readonly
                kendoWidget.enable(false);
            } else if (this.props.readonly) {
                kendoWidget.readonly(true);
            } else {
                kendoWidget.enable(true);
            }
        },

        componentWillReceiveProps: function (nextProps) {
            var cantChange = ['template', 'dataSource', 'valueField', 'displayField', 'placeholder'];
            console.assert(_.isEqual(_.pick(nextProps, cantChange), _.pick(this.props, cantChange)), 'these props cant change after mount');
        },

        componentDidUpdate: function (prevProps, prevState) {

            if (this.props.noControl) {
                // Nothing to do - all done in JSX.
                return;
            }

            var $el = $(this.getDOMNode()).find('#' + this.props.id);
            var kendoWidget = $el.data('kendoMultiSelect');

            if (prevProps.dataSource !== this.props.dataSource) {
                kendoWidget.setDataSource(this.props.dataSource);
            }

            this.setMultiSelectValue(kendoWidget);

            if (this.props.disabled) {
                // disabled beats readonly
                kendoWidget.enable(false);
            } else if (this.props.readonly) {
                kendoWidget.readonly(true);
            } else {
                kendoWidget.enable(true);
            }
        },

        /**
         * Based on more recent version:
         * https://raw.githubusercontent.com/wingspan/wingspan-forms/master/js/controls/KendoMultiSelect.js
         *
         * This fixes issue where react tries to reuse existing widget when AutoPageItemEdit renders new form detail, and
         * console has error "Assertion failed: these props cant change after mount" (because dataSource changes).
         */
        componentWillUnmount: function () {
            var $el = $(this.getDOMNode());
            if($el!==undefined && $el.data('kendoMultiSelect')!==undefined){
                $el.data('kendoMultiSelect').destroy();
            }
        },

        setMultiSelectValue: function(kendoWidget) {
            var vals = [];
            var self = this;
            if(!_.isEmpty(this.props.value)){
                _.each(this.props.value, function (item) {
                    if(_.isObject(item)){
                        vals.push(item[self.props.valueField]);
                    }else{
                        vals.push(item);
                    }
                });
            }
            if(kendoWidget!==undefined){
                kendoWidget.value(vals);
            }
        },

        onChange: function (event) {
            var _this = this;
            var kendoMultiSelect = event.sender;
            var records = kendoMultiSelect.dataItems();
            var scalars = _.map(records, function(record){
                return record[_this.props.valueField];
            });
            this.props.onChange(scalars);
        }
    });

});
