import React from 'react';
import { Query } from "react-apollo";
import { GET_TOPPING_OPTIONS_FOR_SIZE } from './../queries';

const ToppingSelection = (props) => (
  <Query
    query={GET_TOPPING_OPTIONS_FOR_SIZE}
    pollInterval={5000}
    variables={{ name: props.size.toUpperCase() }}
  >
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <div>
          {data.pizzaSizeByName.toppings.map((toppingData, index) => (
            <div key={index}>
              <input
                type="checkbox"
                value={toppingData.topping.name}
                data-price={toppingData.topping.price}
                checked={props.selectedToppings.filter(topping => topping.name === toppingData.topping.name).length > 0}
                onChange={props.handleToppingChange}
                disabled={props.selectedToppings.filter(topping => topping.name === toppingData.topping.name).length > 0 ? false : data.pizzaSizeByName.maxToppings === props.selectedToppings.length ? true : false }
              />
              <label>{`${
                toppingData.topping.name
                } (add $${toppingData.topping.price.toFixed(2)})`}</label>
            </div>
          ))}
        </div>
      );
    }}
  </Query>
);

export default ToppingSelection;