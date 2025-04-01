import { useRef, useEffect } from "react";

const SideEffect = () => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 2000);
  }, [ref]);

  return (
    <div>
      <input
        type="text"
        className="form-control"
        ref={ref}
        placeholder="This will be focused after 2-seconds"
      />
    </div>
  );
};

export default SideEffect;
