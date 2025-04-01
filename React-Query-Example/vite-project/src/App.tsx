import { useState } from 'react';
import Demo from './components/Demo'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
    
    },
    
  },

  queryCache: 
});

function App() {

  const [toggle, setToggle] = useState<boolean>(true);

  return (
    <QueryClientProvider client={queryClient}>
      <button onClick={() => setToggle(prev => !prev)}>Toggle The Demo To Test Caching</button>
      {toggle && <Demo />}
    </QueryClientProvider>
  )
}

export default App
