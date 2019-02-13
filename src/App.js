import React, { Component } from 'react';
import './App.css';
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import PizzaSizes from './components/PizzaSizes';
import ToppingSelection from './components/ToppingSelection';

const client = new ApolloClient({
  uri: "https://core-graphql.dev.waldo.photos/pizza"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pizzaSizeData: null,
      loading: true,
      selectedToppings: [],
      price: 0.00,
      cart: [],
      cartPrice: 0.00
    };
  }

  onSizeSelected = selectedSize => {
    // get new toppings
    let toppings = this.updateToppingsFromDefaults(selectedSize);

    // account for max toppings
    let adjustedToppings = this.applyMaxToppingLimit(toppings, selectedSize.maxToppings)

    // get new price
    const priceOfToppings = this.updatePrice(adjustedToppings);
    const basePrice = selectedSize.basePrice

    this.setState({
      pizzaSizeData: selectedSize,
      selectedToppings: adjustedToppings,
      price: priceOfToppings + basePrice
    })
  };

  handleToppingChange(e) {
    let toppingPrice = parseFloat(e.target.getAttribute("data-price"))
    let alreadySelected = this.state.selectedToppings.filter(topping => topping.name === e.target.value).length > 0;
    if (!alreadySelected) {
      const newSelectedToppings = this.state.selectedToppings.concat({ name: e.target.value, price: toppingPrice });

      this.setState({
        selectedToppings: newSelectedToppings,
        price: (this.state.price + toppingPrice)
      });
    } else {
      const droppedTopping = this.state.selectedToppings.filter(topping => topping.name !== e.target.value);

      this.setState({
        selectedToppings: droppedTopping,
        price: (this.state.price - toppingPrice)
      });
    }
  }

  handleAddToOrder = () => {
    if(this.state.pizzaSizeData === null) {
      window.alert("Please select a pizza first.")
      return;
    }
    const pizzaSize = this.state.pizzaSizeData.name
    const pizzaPrice = this.state.price
    const pizzaToppings = this.state.selectedToppings.length
    const cartPrice = this.state.price + this.state.cartPrice

    this.setState({ cart: this.state.cart.concat({ size: pizzaSize, price: pizzaPrice, toppingCount: pizzaToppings }), pizzaSizeData: null, price: 0.00, selectedToppings: [], cartPrice: cartPrice })
  }

  removeFromOrder = (pizza, number) => {
    let modifiedCartPizzas = this.state.cart.filter(item => item !== pizza)
    let modifiedCartPrice = this.state.cartPrice - pizza.price

    this.setState({cart: modifiedCartPizzas, cartPrice: modifiedCartPrice})
  }

  applyMaxToppingLimit = (toppings, limit) => {
    if(limit === null) return toppings; // large pizzas have null max topping. no need to apply limit.
    if(toppings.length > limit) {
      let difference = toppings.length - limit;
      for (let i = 0; i < difference; i++) {
        toppings.pop()
      }
    }

    return toppings;
  }

  updateToppingsFromDefaults = selectedSize => {
    const toppings = selectedSize.toppings;
    let defaultToppings = toppings.filter(
      toppingData => toppingData.defaultSelected === true
    );
    let toppingsToAdd = [];
    defaultToppings.map(topping => {
      if (!this.state.selectedToppings.filter(selectedTopping => selectedTopping.name === topping.topping.name).length > 0) {
        toppingsToAdd = toppingsToAdd.concat({ name: topping.topping.name, price: topping.topping.price });
      }
    });

    return this.state.selectedToppings.concat(toppingsToAdd)
  };

  updatePrice = (toppings) => {
    let price = 0;
    toppings.map(topping => {
      price = price + topping.price;
    });
    return price;
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="app">
          <h2>
            <span role="img" aria-label="pizza">🍕</span>
            Order your 'za!
            <span role="img" aria-label="pizza">🍕</span>
          </h2>
          <div>
            <h3>Select a Size:</h3>
            <PizzaSizes
              onSizeSelected={size => this.onSizeSelected(size)}
              selectedSize={this.state.pizzaSizeData}
            />
          </div>

          <div style={{ width: '100%', maxWidth: 500 }}>
            <div>
              <div>
                <h3>Select Toppings:</h3>
                {this.state.pizzaSizeData &&
                  <ToppingSelection
                    size={this.state.pizzaSizeData.name}
                    selectedToppings={this.state.selectedToppings}
                    handleToppingChange={topping =>
                      this.handleToppingChange(topping)
                    }
                    updateToppings={data => this.updateToppingsFromDefaults(data)}
                  />
                }
                {!this.state.pizzaSizeData &&
                  <p>Select a size</p>
                }
              </div>
              <div>
                <h3>Pizza Price:</h3>
                <p>{`$${this.state.price.toFixed(2)}`}</p>
              </div>

              <div className="button" onClick={() => this.handleAddToOrder()}>
                <h3>Add to Order</h3>
              </div>
            </div>

            <div>
              <h3>Cart</h3>
              {this.state.cart.length > 0 &&
                this.state.cart.map((pizza, index) => (
                  <div className="cart-pizza" key={index}>
                    <p className="cart-pizza-item">{`#${index + 1} - Size: ${pizza.size}`}</p>
                    <p className="cart-pizza-item">{`# of Toppings: ${pizza.toppingCount}`}</p>
                    <p className="cart-pizza-item">{`Price: $${pizza.price.toFixed(2)}`}</p>
                    <p className="cart-pizza-item" style={{ color: 'red' }} onClick={() => this.removeFromOrder(pizza, index)}>Remove</p>
                  </div>
                ))
              }

              {this.state.cart.length > 0 &&
                <h3>{`ORDER TOTAL: $${this.state.cartPrice.toFixed(2)}`}</h3>
              }

              {this.state.cart.length === 0 &&
                <p>No pizzas in the oven for you yet!</p>
              }

            </div>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;