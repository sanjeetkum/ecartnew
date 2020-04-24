import React, { Component } from 'react';
import { Slider, Button } from 'antd';
import 'antd/es/slider/style/css';
import 'antd/es/button/style/css';

class PriceFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 'large',
      minPrice: 100,
      maxPrice: 100000,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="priceFilter">
        <b>Filter</b>
        <Slider
          range
          defaultValue={[this.state.minPrice, this.state.maxPrice]}
          max={100000}
          onAfterChange={this.props.handlePriceFilter}
          step={500}
        />
        <Button
          className="priceFilter__applyButton"
          type="primary"
          shape="round"
          size={this.state.size}
          onClick={this.props.handleApplyFilter}
        >
          Apply
        </Button>
      </div>
    );
  }
}

export default PriceFilter;
