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

        getInitialState: function (){
            return {
                widget: null,
                widgetState: null
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
                autoBind: false,
                dataSource: this.props.dataSource,
                columns: this.props.columns
            }, this.props.options);
            var gridWidget = $rootNode.kendoGrid(options).data('kendoGrid');
            if(this.props.onWidgetCreate){
                this.props.onWidgetCreate(gridWidget);
            }
            // http://docs.telerik.com/kendo-ui/api/web/grid
            // trigger data binding AFTER parent has reference to widget to allow event handlers
            // to first get reference to the grid widget
            gridWidget.dataSource.read();
            this.setState({widget: gridWidget});
        },

        componentWillUpdate: function(nextProps, nextState){
            // need to capture current widget state (and reapply in componentDidUpdate)
            nextState['widgetState'] = this.getWidgetState();
        },

        componentDidUpdate: function(prevProps, prevState) {
            var widget = this.state.widget;

            // Reset datasource since it might have changed
            if (this.props.dataSource instanceof Array) {
                // This better be a datasource that was originally built from inline data.
                // I don't know how to detect this to verify it.
                widget.dataSource.data(this.props.dataSource);
            }
            else if (prevProps.dataSource !== this.props.dataSource) {
                widget.setDataSource(this.props.dataSource);
            }
            // Since we are not autobinding, need to explicitly re-read data source, ..
            widget.dataSource.read();
            // Finally, need to re-apply last user-made changes widget state (e.g. sorting, grouping, filtering, etc.)
            // that was captured in componentWillUpdate
            this.setWidgetState(this.state.widgetState);

        },

        /**
         * Based on http://www.telerik.com/forums/saving-grid-state, which refers to
         * this fiddle: http://jsbin.com/erefug/1/edit
         * @returns {{page: *, pageSize: *, sort: *, filter: *, group: *}}
         */
        getWidgetState: function () {
            var widget = this.state.widget;
            if(!widget){
                return null;
            }
            // todo: also capture group collapsed/expanded state (see http://demos.telerik.com/kendo-ui/grid/api)
            return {
                page: widget.dataSource.page(),
                pageSize: widget.dataSource.pageSize(),
                sort: widget.dataSource.sort(),
                filter: widget.dataSource.filter(),
                group: widget.dataSource.group()
            };
        },

        setWidgetState: function(state){
            var widget = this.state.widget;
            if(widget && state){
                widget.dataSource.filter(state.filter);
                widget.dataSource.sort(state.sort);
                widget.dataSource.group(state.group);
                widget.dataSource.pageSize(state.pageSize);
                widget.dataSource.page(state.page);
            }
        }


    });

    return KendoGrid;
});