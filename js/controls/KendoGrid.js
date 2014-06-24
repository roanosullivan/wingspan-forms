/** @jsx React.DOM */
define([
    'underscore', 'jquery', 'react', 'kendo',
    'jsx!bower_components/wingspan-forms/js/ImmutableOptimizations'
], function (_, $, React, kendo, ImmutableOptimizations) {
    'use strict';

    var KendoGrid = React.createClass({
        mixins: [ImmutableOptimizations],

        getDefaultProps: function () {
            return {
                className: '',
                dataSource: undefined,
                columns: undefined,
                options: {},
                onWidgetCreate: undefined // callback for getting reference to underlying KendoGridWidget
            };
        },

        render: function () {
            console.assert(this.props.dataSource);
            console.assert(this.props.columns);
            return (<div className={this.props.className} />);
        },

        componentDidMount: function () {
            var $rootNode = $(this.getDOMNode());
            void kendo;
            var options = _.extend({
                dataSource: this.props.dataSource,
                columns: this.props.columns
            }, this.props.options);
            var gridWidget = $rootNode.kendoGrid(options).data('kendoGrid');
            if(this.props.onWidgetCreate){
                this.props.onWidgetCreate(gridWidget);
            }
        },

        componentDidUpdate: function (prevProps, prevState) {
            var $el = $(this.getDOMNode());
            var kendoWidget = $el.data('kendoGrid');

            if (this.props.dataSource instanceof Array) {
                // This better be a datasource that was originally built from inline data.
                // I don't know how to detect this to verify it.
                kendoWidget.dataSource.data(this.props.dataSource);
            }
            else if (prevProps.dataSource !== this.props.dataSource) {
                kendoWidget.setDataSource(this.props.dataSource);
            }
        }
    });

    return KendoGrid;
});