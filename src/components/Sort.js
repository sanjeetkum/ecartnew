import React, { Component } from 'react';

class Sort extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="sort">
        <p className="sort__sortpara">
          <b>Sort By</b>{' '}
          <a href="#" onClick={this.props.handleDscSort} tabIndex="1">
            Price -- Low High
          </a>{' '}
          <a href="#" onClick={this.props.handleAscSort} tabIndex="2">
            Price -- High Low
          </a>{' '}
          <a href="#" onClick={this.props.handleDiscountSort} tabIndex="3">
            Discount
          </a>{' '}
        </p>
      </div>
    );
  }
}

export default Sort;
