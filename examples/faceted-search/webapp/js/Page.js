/** @jsx React.DOM */
define([
    'underscore', 'underscore.string', 'react', 'jquery', 'kendo', 'wingspan-forms',
    'util',
    'FacetDataStore',
    'text!textassets/types/Contact.json'
], function (_, str, React, $, kendo, Forms, util, FacetDataStore, ContactModel) {
    'use strict';

    var ContactModel = JSON.parse(ContactModel).data;


    var App = React.createClass({
        mixins: [Forms.TopStateMixin],

        getInitialState: function () {
            this.emptyFilters = _.object(_.map(_.keys(ContactModel.properties), function (field) { return [field, []]; }));
            return {
                filters: this.emptyFilters,
                facets: {}
            };
        },

        componentWillMount: function () {
            this.columns = [
                { title: ContactModel.properties['firstName'].label, width: '20%', template: '#: firstName #' },
                { title: ContactModel.properties['lastName'].label, width: '20%', template: '#: lastName #' },
                { title: ContactModel.properties['contactGroup'].label, width: '15%', template: '#: contactGroup #' },
                //{ template: '#: phoneNumber #' },
                { title: ContactModel.properties['email'].label, template: '#: email #' }
            ];
            this.dataSource = new FacetDataStore();
            this.dataSource._facetFilters = this.state.filters;
            this.dataSource.read().then(this.updateFacets).done();
        },

        componentWillUpdate: function (nextProps, nextState) {
            // if our filter state changed, we need to query for the facets
            if (!_.isEqual(this.state.filters, nextState.filters)) {
                this.dataSource._facetFilters = nextState.filters; // how to plumb this nicely?
                this.dataSource.read().then(this.updateFacets).done();
            }
        },

        updateFacets: function () {
            this.setState({ facets: this.dataSource.facets });
        },

        onFilterToggle: function (facet/*contactGroup*/, value/*work*/, isActive/*true*/) {
            var currentFiltersForField = this.state.filters[facet];
            var nextFiltersForField = (isActive ? _.union :_.difference)(currentFiltersForField, [value]);
            this.onChange('filters', facet, nextFiltersForField);
        },

        onClearFilters: function () {
            this.onChange('filters', this.emptyFilters);
        },

        onClearFilter: function (facet, filter) {
            this.onChange('filters', facet, _.difference(this.state.filters[facet], [filter]));
        },

        render: function () {

            var facetControls = _.map(this.state.facets, function (countsByVal/*work:6*/, facet/*contactGroup*/) {
                var nonZeroCountsByVal = util.filterMap(countsByVal, function (pair) {
                    return pair[1] !== 0;
                });
                var checkboxes = _.map(nonZeroCountsByVal, function (count, val) {
                    var controlId = str.sprintf('%s-%s', facet, val);
                    return (
                        <div className="facetFilterControl" key={controlId}>
                            <CheckBox label={val} id={controlId} value={_.contains(this.state.filters[facet], val)}
                                onChange={_.partial(this.onFilterToggle, facet, val)}/>
                            <span className="count">{count}</span>
                        </div>
                    );
                }.bind(this));
                return (
                    <FormField key={facet} fieldInfo={_.object([['label', ContactModel.properties[facet].label]])}>
                        {checkboxes}
                    </FormField>
                );
            }.bind(this));

            var filterControls = _.map(this.state.filters, function (filters, facet) {
                return _.map(filters, function (filter) {
                    var key = str.sprintf('%s-%s', facet, filter);
                    return (<span className="filter">{filter}<i className="closer" onClick={_.partial(this.onClearFilter, facet, filter)} /></span>);
                }.bind(this));
            }.bind(this));

            filterControls = _.flatten(filterControls);
            filterControls = (filterControls.length > 0
                ? (<span className="filters"><span className="trash" onClick={this.onClearFilters}/>{_.flatten(filterControls)}</span>)
                : (<span className="hint">Use filters on the left to narrow results.</span>));

            return (
                <div className="App">
                    <div className="table">
                        <div className="row">
                            <div className="left"></div>
                            <div className="right">
                                <div>
                                    <div className="filterControls">
                                        {filterControls}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="left">
                                <div>{facetControls}</div>
                            </div>
                            <div className="right">
                                <div>
                                    <KendoGrid className="KendoGrid" dataSource={this.dataSource}
                                    columns={this.columns} height="400" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <pre>{JSON.stringify(this.state, undefined, 2)}</pre>
                </div>
            );
        }
    });


    function entrypoint(rootElement) {
        React.renderComponent(<App />, rootElement);
    }


    var FormField = Forms.FormField;
    var KendoText = Forms.KendoText;
    var MultilineText = Forms.MultilineText;
    var MultiSelect = Forms.MultiSelect;
    var KendoComboBox = Forms.KendoComboBox;
    var KendoNumber = Forms.KendoNumber;
    var KendoDate = Forms.KendoDate;
    var KendoDatetime = Forms.KendoDatetime;
    var CheckBox = Forms.CheckBox;
    var Radio = Forms.Radio;
    var RadioGroup = Forms.RadioGroup;
    var SwitchBox = Forms.SwitchBox;
    var Carousel = Forms.Carousel;
    var KendoGrid = Forms.KendoGrid;


    return {
        entrypoint: entrypoint
    };
});
