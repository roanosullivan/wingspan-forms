define([
    './AutoControl',
    './FormField',
    './controls/Button',
    './controls/Carousel',
    './controls/CheckBox',
    './controls/KendoComboBox',
    './controls/KendoDate',
    './controls/KendoTime',
    './controls/KendoDatetime',
    './controls/KendoGrid',
    './controls/KendoGridPicker',
    './controls/KendoGridPickerByButton',
    './controls/KendoGridRadioSelectable',
    './controls/KendoListView',
    './controls/KendoMultiSelect',
    './controls/KendoNumber',
    './controls/KendoTabStrip',
    './controls/KendoText',
    './controls/MultiSelect',
    './controls/MultilineText',
    './controls/Radio',
    './controls/RadioGroup',
    './controls/SwitchBox',
    './controls/UserPicker',
    './controls/UserPickerPlus',
    './controls/KendoPager',
    './controls/PromiseButton',
    './controls/SearchBox',
    './controls/SelectionListDismissible',
    './ControlCommon',
    './AutoField',
    './FluxFormMixin'
], function (AutoControl, FormField, Button, Carousel, CheckBox, KendoComboBox, KendoDate, KendoTime, KendoDatetime,
             KendoGrid, KendoGridPicker, KendoGridPickerByButton, KendoGridRadioSelectable,
             KendoListView, KendoMultiSelect, KendoNumber, KendoTabStrip, KendoText, MultiSelect,
             MultilineText, Radio, RadioGroup, SwitchBox, UserPicker, UserPickerPlus,
             KendoPager, PromiseButton, SearchBox, SelectionListDismissible, ControlCommon,
             AutoField, FluxFormMixin) {
    'use strict';



    // This module should never actually be used.  It exists only to collect all of the top-level modules into one
    // place so that the require optimizer can do a single-page optimization across the entire application
    //
    // It also must collect all of the items from the component registry.  They are needed because they do not
    // have any "hard" require references that the optimizer can see.
    //
    // Specifically, parameters to the container function do not need to be declared, and this body should not do anything
    return {
        AutoControl: AutoControl,
        FormField: FormField,
        Button: Button,
        Carousel: Carousel,
        CheckBox: CheckBox,
        KendoComboBox: KendoComboBox,
        KendoDate: KendoDate,
        KendoTime: KendoTime,
        KendoDatetime: KendoDatetime,
        KendoGrid: KendoGrid,
        KendoGridPicker: KendoGridPicker,
        KendoGridPickerByButton: KendoGridPickerByButton,
        KendoGridRadioSelectable: KendoGridRadioSelectable,
        KendoListView: KendoListView,
        KendoMultiSelect: KendoMultiSelect,
        KendoNumber: KendoNumber,
        KendoTabStrip: KendoTabStrip,
        KendoText: KendoText,
        MultiSelect: MultiSelect,
        MultilineText: MultilineText,
        Radio: Radio,
        RadioGroup: RadioGroup,
        SwitchBox: SwitchBox,
        UserPicker: UserPicker,
        UserPickerPlus: UserPickerPlus,
        KendoPager: KendoPager,
        PromiseButton: PromiseButton,
        SearchBox: SearchBox,
        SelectionListDismissible: SelectionListDismissible,
        ControlCommon: ControlCommon,
        AutoField: AutoField,
        FluxFormMixin: FluxFormMixin
    };
});
