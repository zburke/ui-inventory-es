import React from 'react';
import PropTypes from 'prop-types';

import CheckboxFacetList from './CheckboxFacetList';

import { accentFold } from '../../utils';

const SHOW_OPTIONS_COUNT = 5;
const SHOW_OPTIONS_INCREMENT = 5;

export default class CheckboxFacet extends React.Component {
  static propTypes = {
    dataOptions: PropTypes.arrayOf(PropTypes.shape({
      disabled: PropTypes.bool,
      label: PropTypes.node,
      readOnly: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      count: PropTypes.number,
    })).isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    isFilterable: PropTypes.bool,
  };

  static defaultProps = {
    selectedValues: [],
    isFilterable: false,
  }

  state = {
    more: SHOW_OPTIONS_COUNT,
    searchTerm: '',
  };

  onMoreClick = (totalOptions) => {
    this.setState(({ more }) => {
      let visibleOptionsCount = more + SHOW_OPTIONS_INCREMENT;
      const showingAll = visibleOptionsCount >= totalOptions;
      if (showingAll) visibleOptionsCount = totalOptions;

      return { more: visibleOptionsCount };
    });
  };

  onFacetSearch = searchTerm => {
    this.setState({ searchTerm });
  };

  onFasetChange = (filterValue) => (e) => {
    const {
      name,
      selectedValues,
      onChange,
    } = this.props;

    const newValues = e.target.checked
      ? [...selectedValues, filterValue]
      : selectedValues.filter((value) => value !== filterValue);

    onChange({
      name,
      values: newValues,
    });
  };

  render() {
    const {
      dataOptions,
      selectedValues,
      isFilterable,
      name,
    } = this.props;

    const {
      more,
      searchTerm,
    } = this.state;

    let filteredOptions = dataOptions;

    if (searchTerm.trim()) {
      filteredOptions = filteredOptions.filter(option => {
        return accentFold(option.label)
          .toLowerCase()
          .includes(accentFold(searchTerm).toLowerCase());
      });
    }

    return (
      <CheckboxFacetList
        fieldName={name}
        dataOptions={filteredOptions.slice(0, more)}
        selectedValues={selectedValues}
        showMore={filteredOptions.length > more}
        showSearch={isFilterable}
        onMoreClick={() => this.onMoreClick(filteredOptions.length)}
        onSearch={this.onFacetSearch}
        onChange={this.onFasetChange}
      />
    );
  }
}
