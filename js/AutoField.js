/** @jsx React.DOM */
define([
    'underscore', 'react', 'jsx!bower_components/wingspan-forms/js/FormField', 'jsx!bower_components/wingspan-forms/js/AutoControl', 'jsx!bower_components/wingspan-forms/js/ImmutableOptimizations'
], function (_, React, FormField, AutoControl, ImmutableOptimizations) {
    'use strict';


    var AutoField = React.createClass({
        mixins: [ImmutableOptimizations],

        getDefaultProps: function () {
            return {
                fieldInfo: undefined,
                value: undefined,
                onChange: undefined,
                isValid: [true, ''],
                dataSource: undefined
            };
        },

        render: function () {
            return (
                <FormField fieldInfo={this.props.fieldInfo} isValid={this.props.isValid} key={this.props.fieldInfo.name}>
                    <AutoControl
                        fieldInfo={this.props.fieldInfo}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        dataSource={this.props.dataSource} />
                </FormField>
            );
        }
    });


    return AutoField;
});
