import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "../state/store";
import { increment, decrement, incrementByValue, decrementByValue, incrementAsync } from "../slices/CounterSlice";

const Counter = () => {

  const count = useSelector((state: RootState) => state.counter.value);

  const dispatch = useAppDispatch();

  return (
    <>
      <h2>The Current Count is: {count}</h2>

      <div>

        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>

      </div>

      <div>

        <button onClick={() => dispatch(incrementByValue(100))}>Increment By 100</button>
        <button onClick={() => dispatch(decrementByValue(100))}>Decrement By 100</button>

      </div>

      <div>

        <button onClick={() => dispatch(incrementAsync(100))}>Increment Async By 100</button>
        
      </div>
    </>
  )
}

export default Counter