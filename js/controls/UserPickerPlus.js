/** @jsx React.DOM */
define([
    'underscore', 'react',
    'jsx!bower_components/wingspan-forms/js/controls/RadioGroup',
    'jsx!bower_components/wingspan-forms/js/controls/UserPicker',
    'jsx!bower_components/wingspan-forms/js/ImmutableOptimizations'
], function (_, React, RadioGroup, UserPicker, ImmutableOptimizations) {
    'use strict';

    void UserPicker;
    /**
     * This is a user picker control that is similar to the UserPicker but differs by
     * 1) it's given a list of users for radio buttons,
     * 2) The last radio button allows a user to be selected using a standard picker control
     * 3) it has no multi-select feature (single only).
     */
    return React.createClass({

        displayName: 'UserPickerPlus',
        mixins: [ImmutableOptimizations],
        statics: { fieldClass: function () { return 'formFieldRadio'; } },

        getDefaultProps: function () {
            return {
                value: undefined,
                disabled: false,
                readonly: false
            };
        },

        componentWillMount: function () {
            console.assert(this.props.dataSource);

            this.elemIDPrefix = _.uniqueId('userPickerRadio');
        },

        /*jshint ignore:start */
        render: function () {
            var props = this.props,
                pickerValue = props.value,
                idPrefix = this.elemIDPrefix;

            function onChangeRadio(e) {
                var index = parseInt(e.target.value);
                props.onChange(props.userList[index]);
            }

            function makeRadio(user, index) {
                var elemID = idPrefix + index;
                var checked = _.isEqual(user, props.value);

                return [
                    (<input type="radio" name={props.name} id={elemID} value={index} checked={checked} onChange={onChangeRadio}/>),
                    (<label htmlFor={elemID}>{user.fullName}</label>),
                    (<br/>)
                ];
            }

            // If the "value" is one of the users in the userList, we don't want to pass it to the picker.
            if (_.some(props.userList, function (user) { return _.isEqual(user, pickerValue) } )) {
                pickerValue = null;
            }

            return(
                <fieldset>
                    {_.flatten(_.map(props.userList, makeRadio))}
                    <input type="radio" name={props.name} id={idPrefix + 'Last'} checked={!!pickerValue} />
                    <label htmlFor={idPrefix + 'Last'}>
                        <UserPicker onChange={props.onChange} placeholder={props.placeholder}
                                    value={pickerValue} dataSource={props.dataSource} width={props.width} />
                    </label>
                </fieldset>
            );
        }
        /*jshint ignore:end */
    });
});
