import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Header from './components/Header';
import Products from './components/Products';
import Footer from './components/Footer';
import QuickView from './components/QuickView';
import Sort from './components/Sort';
import './scss/style.scss';
import PriceFilter from './components/PriceFilter';
import { Col, Row } from 'antd';
import 'antd/es/row/style/css';
import 'antd/es/col/style/css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      cart: [],
      totalItems: 0,
      totalAmount: 0,
      term: '',
      category: '',
      cartBounce: false,
      quantity: 1,
      quickViewProduct: {},
      modalActive: false,
      filteredData: [],
      filterUnderProgress: false,
      min: '',
      max: '',
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleMobileSearch = this.handleMobileSearch.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.sumTotalItems = this.sumTotalItems.bind(this);
    this.sumTotalAmount = this.sumTotalAmount.bind(this);
    this.checkProduct = this.checkProduct.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleAscSort = this.handleAscSort.bind(this);
    this.handleDscSort = this.handleDscSort.bind(this);
    this.handleDiscountSort = this.handleDiscountSort.bind(this);
    this.handlePriceFilter = this.handlePriceFilter.bind(this);
    this.handleApplyFilter = this.handleApplyFilter.bind(this);
  }
  // Fetch Initial Set of Products from external API
  getProducts() {
    let url = 'https://api.jsonbin.io/b/5e9f3352435f5604bb458747/1';
    axios.get(url).then((response) => {
      this.setState({
        products: response.data.items,
      });
    });
  }
  componentWillMount() {
    this.getProducts();
  }

  // Search by Keyword
  handleSearch(event) {
    this.setState({ term: event.target.value });
  }
  handleDscSort(event) {
    let ascproducts = [];
    if (this.state.products[0].price.actual) {
      ascproducts = this.state.products.sort(function (a, b) {
        return a.price.actual - b.price.actual;
      });
      this.setState({ products: ascproducts });
    }
  }
  handleAscSort(event) {
    let dscproducts = [];
    if (this.state.products[0].price.actual) {
      dscproducts = this.state.products.sort(function (a, b) {
        return b.price.actual - a.price.actual;
      });
      this.setState({ products: dscproducts });
    }
  }
  handleDiscountSort(event) {
    let discountproducts = [];
    if (this.state.products[0].price.actual) {
      discountproducts = this.state.products.sort(function (a, b) {
        return b.discount - a.discount;
      });
      this.setState({ products: discountproducts });
    }
  }

  async handlePriceFilter(value) {
    console.log(value);
    await this.setState({ min: value[0], max: value[1] });
    this.getProducts();
  }
  async handleApplyFilter() {
    console.log('min is ' + this.state.min + 'max is ' + this.state.max);
    this.state.filteredData = [];

    if (this.state.products) {
      this.state.products.forEach((prodItem) => {
        if (
          prodItem.price.actual > this.state.min &&
          prodItem.price.actual < this.state.max
        ) {
          this.state.filteredData.push(prodItem);
        }
      });
      await this.setState({
        products: [...this.state.filteredData],
      });
    }
  }

  // Mobile Search Reset
  handleMobileSearch() {
    this.setState({ term: '' });
  }
  // Filter by Category
  handleCategory(event) {
    this.setState({ category: event.target.value });
    console.log(this.state.category);
  }
  // Add to Cart
  handleAddToCart(selectedProducts) {
    let cartItem = this.state.cart;
    let productID = selectedProducts.id;
    let productQty = selectedProducts.quantity;
    if (this.checkProduct(productID)) {
      let index = cartItem.findIndex((x) => x.id == productID);
      cartItem[index].quantity =
        Number(cartItem[index].quantity) + Number(productQty);
      this.setState({
        cart: cartItem,
      });
    } else {
      cartItem.push(selectedProducts);
    }
    this.setState({
      cart: cartItem,
      cartBounce: true,
    });
    setTimeout(
      function () {
        this.setState({
          cartBounce: false,
          quantity: 1,
        });
        console.log(this.state.quantity);
        console.log(this.state.cart);
      }.bind(this),
      1000
    );
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
  }
  handleRemoveProduct(id, e) {
    let cart = this.state.cart;
    let index = cart.findIndex((x) => x.id == id);
    cart.splice(index, 1);
    this.setState({
      cart: cart,
    });
    this.sumTotalItems(this.state.cart);
    this.sumTotalAmount(this.state.cart);
    e.preventDefault();
  }
  checkProduct(productID) {
    let cart = this.state.cart;
    return cart.some(function (item) {
      return item.id === productID;
    });
  }
  async sumTotalItems() {
    let total = 0;
    let cart = this.state.cart;
    total = cart.length;
    await this.setState({
      totalItems: total,
    });
  }
  async sumTotalAmount() {
    let total = 0;
    let cart = this.state.cart;
    for (var i = 0; i < cart.length; i++) {
      total += cart[i].price * parseInt(cart[i].quantity);
    }
    await this.setState({
      totalAmount: total,
    });
  }

  //Reset Quantity
  updateQuantity(qty) {
    console.log('quantity added...');
    this.setState({
      quantity: qty,
    });
  }
  // Open Modal
  openModal(product) {
    this.setState({
      quickViewProduct: product,
      modalActive: true,
    });
    console.log('quickViewProduct' + this.state.quickViewProduct);
  }
  // Close Modal
  closeModal() {
    this.setState({
      modalActive: false,
    });
  }

  render() {
    return (
      <div className="container">
        <Header
          cartBounce={this.state.cartBounce}
          total={this.state.totalAmount}
          totalItems={this.state.totalItems}
          cartItems={this.state.cart}
          removeProduct={this.handleRemoveProduct}
          handleSearch={this.handleSearch}
          handleMobileSearch={this.handleMobileSearch}
          handleCategory={this.handleCategory}
          categoryTerm={this.state.category}
          updateQuantity={this.updateQuantity}
          productQuantity={this.state.moq}
        />
        <Col span={24} className="bg-color">
          <Sort
            handleAscSort={this.handleAscSort}
            handleDscSort={this.handleDscSort}
            handleDiscountSort={this.handleDiscountSort}
          />
        </Col>
        <Row>
          <Col lg={{ span: 4 }} xs={{ span: 24 }} className="bg-color">
            <PriceFilter
              handlePriceFilter={this.handlePriceFilter}
              handleApplyFilter={this.handleApplyFilter}
            />
          </Col>
          <Col lg={{ span: 16, offset: 2 }} sm={{ span: 24, offset: 0 }}>
            <Products
              productsList={this.state.products}
              searchTerm={this.state.term}
              addToCart={this.handleAddToCart}
              productQuantity={this.state.quantity}
              updateQuantity={this.updateQuantity}
              openModal={this.openModal}
            />
          </Col>
        </Row>
        <Footer />
        <QuickView
          product={this.state.quickViewProduct}
          openModal={this.state.modalActive}
          closeModal={this.closeModal}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
