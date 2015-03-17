/** @jsx React.DOM */
define([
    'underscore', 'jquery', 'react',
    'jsx!assets/wingspan-forms/js/ImmutableOptimizations'
], function (_, $, React, ImmutableOptimizations) {
    'use strict';

    var SPACE_KEY = 32;
    var SPAN_STYLE = {
        display: 'inline-block',
        height: '38px'
    };

    function ignoreClick() { }

    var SwitchBox = React.createClass({
        mixins: [ImmutableOptimizations],

        statics: { fieldClass: function () { return 'formFieldSwitch'; } },

        getDefaultProps: function () {
            return {
                value: undefined,
                onChange: function () {},
                isValid: [true, ''],
                disabled: false,
                readonly: false,
                noControl: false,    // does this even make sense on a switchbox?
                id: undefined
            };
        },

        /*jshint ignore:start */
        render: function () {


            if (this.props.noControl) {
                return (<span>{this.getDisplayValue()}</span>);
            }

            var yes = this.props.value === true;
            var no = this.props.value === false;

            var clickYes = this.props.readonly ? ignoreClick : _.partial(this.props.onChange, true);
            var clickNo =  this.props.readonly ? ignoreClick : _.partial(this.props.onChange, false);

            // this <label> is part of the switchbox markup, not the <FormField>'s label
            // < span style={SPAN_STYLE}
            return (
                // 20141118 roan: hardcode width to minimum required; this allows "formFieldNoWrap" layout to work
                <div tabIndex="0" className="switch" style={{width: "7.1em;"}} >
                    <input type="hidden" name={this.props.name} value={this.props.value} />
                    <ul>
                        <li className={yes ? 'active' : ''} onClick={clickYes}><span className={yes ? 'pos' : ''}>Yes</span></li>
                        <li className={no ? 'active' : ''} onClick={clickNo}><span className={no ? 'neg' : ''}>No</span></li>
                    </ul>
                </div>
            );
        },
        /*jshint ignore:end */

        componentDidMount: function () {
            var self = this,
                $el = $(this.getDOMNode());

            $el.on('keypress', function (e) {
                if (e.keyCode === SPACE_KEY) {
                    self.props.onChange(!self.props.value);
                }
            });
        },

        componentWillUnmount: function () {
            $(this.getDOMNode()).off('keypress');
        },

        getDisplayValue: function () {
            return !!this.props.value ? 'Yes' : 'No'; // l10n requires thought, no locale manager all the way down here.
            // Also need to localize the switchbox images as the words "on" "off" appear.
        }
    });

    void SPAN_STYLE;

    return SwitchBox;

});
