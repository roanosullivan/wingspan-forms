/** @jsx React.DOM */
define([
    'underscore', 'react',
    'jsx!bower_components/wingspan-forms/js/AutoControl',
    'jsx!bower_components/wingspan-forms/js/ControlCommon',
    'jsx!bower_components/wingspan-forms/js/ImmutableOptimizations'
], function (_, React, AutoControl, ControlCommon, ImmutableOptimizations) {
    'use strict';

    function determineFieldClass(children) {
        if (_.isArray(children)) {
            children = children[0];
        }

        if (children && _.isUndefined(children.type.fieldClass)) {
            // Support a textnode child, which won't have a fieldinfo
            if (children.props && children.props.fieldInfo) {
                return AutoControl.fieldClassForField(children.props.fieldInfo);
            }
            //console.warn('Unknown fieldClass for child component', children);

            return 'formFieldInput';
        }

        return children && children.type.fieldClass();
    }

    var FormField = React.createClass({
        mixins: [ImmutableOptimizations],

        getDefaultProps: function () {
            return {
                fieldInfo: {},
                layout: 'formField',
                noControl: false,
                isValid: [true, ''],
                lockable: false,
                locked: false,
                onStickyChange: function (isLocked) { /* set or clear a sticky */},
                width: '100%',
                marginLeft: '0',
                noLabel: false
            };
        },

        /* jshint ignore:start */
        render: function () {
            var fieldInfo = _.defaults(this.props.fieldInfo, {
                readOnly: false,
                disabled: false,
                label: '',
                helpText: ''
            });

            var hasInfoTooltip = !!fieldInfo.helpText;
            var hasErrorTooltip = (!this.props.isValid[0] && (this.props.isValid[1] || '').length > 0);

            var classes = _.compact([
                this.props.layout,
                determineFieldClass(this.props.children),
                ControlCommon.quadState(fieldInfo.disabled, fieldInfo.readOnly, this.props.isValid, this.props.noControl),
                hasInfoTooltip ? 'hasTooltip' : null,
                hasErrorTooltip ? 'hasErrorTooltip' : null,
                this.props.lockable ? 'lockable' : null
            ]);

            var lockedClasses = _.compact(['fieldLock', this.props.locked ? 'fieldLockOn' : null]);
            var lockDiv = this.props.lockable ? (<div className={lockedClasses.join(' ')} onClick={this.toggleLock} />) : null;

            var styles = {
               'width': this.props.width,
               'margin-left': this.props.marginLeft
            };

            var statusIcon = (hasInfoTooltip ? (<span className="statusIcon" />) : null);

            // If there is no label and no icon, we must render &nbsp; so the fields line up right.


            var label = ((fieldInfo.label || '').length === 0 && statusIcon === null
                ? (<label className="formLabel">{'\u00A0'}</label>) // unicode &nbsp; to work around JSX bug:  https://groups.google.com/forum/?fromgroups=#!topic/reactjs/7FmlIyJBofA
                : (<label className="formLabel">{fieldInfo.label}{statusIcon}</label>));

            return (
                <div className={classes.join(' ')} data-tooltip={fieldInfo.helpText} data-error-tooltip={this.props.isValid[1]} style={styles}>
                    {this.props.noLabel ? null : label}
                    <div className="formElement">
                        {this.props.children}
                    </div>
                    {lockDiv}
                </div>
            );
        },
        /* jshint ignore:end */

        componentWillReceiveProps: function (newProps) {
            var wasInvalid = !this.props.isValid[0];

            // If the field has become valid, hide the error tooltip.
            if (wasInvalid && newProps.isValid[0]) {
                ControlCommon.hideErrorTooltip();
            }
        },

        componentDidUpdate: function (prevProps) {
            var wasInvalid = prevProps.isValid[0] === false,
                isStillInvalid = this.props.isValid[0] === false,
                validationMessageChanged = prevProps.isValid[1] !== this.props.isValid[1];

            if (wasInvalid && isStillInvalid && validationMessageChanged) {
                ControlCommon.refreshErrorTooltip();
            }
        },

        toggleLock: function () {
            var isLocked = !this.props.locked;
            this.props.onStickyChange(isLocked);
            this.setState({ locked: isLocked });
        }
    });

    return FormField;
});
