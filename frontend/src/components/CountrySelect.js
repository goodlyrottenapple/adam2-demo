import { jsx } from '@emotion/core';
import { groupedCountries } from './data/countries';
import Select from '@atlaskit/select';
// custom option renderer
const labelCSS = () => ({
    alignItems: 'center',
    display: 'flex',
    lineHeight: 1.2,
});
const flagCSS = () => ({
    fontSize: '18px',
    marginRight: '8px',
});
const Opt = ({ children, icon }) => (jsx("div", { css: labelCSS() },
    jsx("span", { css: flagCSS() }, icon),
    children));
// return the country name; used for searching
const getOptionLabel = (opt) => opt.name;
// set the country's abbreviation for the option value, (also searchable)
const getOptionValue = (opt) => opt.abbr;
// the text node of the control
// const controlLabel = (opt) => (jsx(Opt, { icon: opt.icon }, opt.abbr.toUpperCase()));
// // the text node for an option
const optionLabel = ({ abbr, icon, name }) => (jsx(Opt, { icon: icon },
    name,
    " (",
    abbr.toUpperCase(),
    ")"));
// switch formatters based on render context (menu | value)
const formatOptionLabel = (opt, { context }) => optionLabel(opt);
// put it all together
const CountrySelect = (props) => (jsx(Select, Object.assign({ isClearable: false, formatOptionLabel: formatOptionLabel, getOptionLabel: getOptionLabel, getOptionValue: getOptionValue, isMulti: false, options: groupedCountries, styles: {
        container: css => ({ ...css }),
        dropdownIndicator: css => ({ ...css, paddingLeft: 0 }),
        menu: css => ({ ...css }),
    } }, props)));
export default CountrySelect;