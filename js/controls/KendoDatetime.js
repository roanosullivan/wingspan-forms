/** @jsx React.DOM */
define([
    'underscore', 'jquery', 'react', 'kendo',
    'jsx!bower_components/wingspan-forms/js/util/util',
    'jsx!bower_components/wingspan-forms/js/ControlCommon',
    'jsx!bower_components/wingspan-forms/js/ImmutableOptimizations'
], function (_, $, React, kendo, util, ControlCommon, ImmutableOptimizations) {
    'use strict';


    var KendoDateTime = React.createClass({
        mixins: [ImmutableOptimizations],

        statics: { fieldClass: function () { return 'formFieldDatetimepicker'; } },

        getDefaultProps: function () {
            return {
                value: undefined, // ISO 8601 string, NOT a js date instance
                onChange: function () {},
                id: undefined,
                disabled: false,
                isValid: [true, ''],
                readonly: false,
                noControl: false,
                format: 'MM/dd/yyyy h:mm tt'
            };
        },

        /*jshint ignore:start */
        render: function () {
            return (this.props.noControl
                ? (<span>{this.props.value ? kendo.toString(util.parseISODateTime(this.props.value), this.props.format) : ''}</span>)
                : (<input id={this.props.id} type="text" />));
        },
        /*jshint ignore:end */

        componentDidMount: function () {

            if (this.props.noControl) {
                // Everything was done in JSX.
                return;
            }

            var $el = $(this.getDOMNode());

            $el.kendoDateTimePicker({
                change: this.onChange,
                format: this.props.format
            });

            ControlCommon.setKendoDateState(
                $el.data('kendoDateTimePicker'),
                util.parseISODateTime(this.props.value), this.props.disabled, this.props.readonly,
                this.props.max, this.props.min);
        },

        componentDidUpdate: function (prevProps, prevState) {

            if (this.props.noControl) {
                // Everything was done in JSX.
                return;
            }

            var $el = $(this.getDOMNode());

            ControlCommon.setKendoDateState(
                $el.data('kendoDateTimePicker'),
                util.parseISODateTime(this.props.value), this.props.disabled, this.props.readonly,
                this.props.max, this.props.min);
        },

        onChange: function (event) {
            var kendoWidget = event.sender;
            var val = util.formatISODateTime(kendoWidget.value());
            this.props.onChange(val);
        }
    });

    return KendoDateTime;
});
