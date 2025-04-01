
interface Props {
    cartItems: string[];
    onClear: () => void;
}

const Cart = ( { cartItems, onClear }: Props) => {
  return (
    <div>
        Cart With Items: { cartItems.map(cartItem => <p key={ cartItem }> { cartItem }</p>) }

        <button onClick={ onClear }>Clear</button>
    </div>
  )
}

export default Cart