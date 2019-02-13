import React from 'react';
import { Query } from "react-apollo";
import GET_ALL from './../queries';

const PizzaSizes = props => (
  <Query query={GET_ALL} pollInterval={5000}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;
      const selectedName = props.selectedSize ? props.selectedSize.name : "";
      return (
        <div style={{ display: 'flex ', width: 500, justifyContent: 'space-around'}}>
          {data.pizzaSizes.map(size => (
            <p onClick={() => props.onSizeSelected(size)}
              style={{ textAlign: 'center', color: selectedName === size.name ? "orange" : "gray" }}>{`${size.name.toUpperCase()} ($${size.basePrice.toFixed(2)})`}</p>
          ))}
        </div>

      );
    }}
  </Query>
);

export default PizzaSizes;