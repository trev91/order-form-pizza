import gql from "graphql-tag";
export const GET_ALL = gql`
{
  pizzaSizes {
    name
    basePrice
    maxToppings
    toppings {
      topping {
        name
        price
      }
      defaultSelected @include(if: true)
    }
  }
}
`;

export const GET_TOPPING_OPTIONS_FOR_SIZE = gql`
  query pizzaSizeByName($name:PizzaSizes!) {


   pizzaSizeByName(name: $name) {
    name
    basePrice
    maxToppings,
    toppings {
      defaultSelected
      topping {
        name,
        price,
      }
    }
  }
}
`;

export default GET_ALL;