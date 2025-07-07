import { Route, Switch } from "wouter";
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SlugRedirect from './pages/SlugRedirect'
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./queries/client"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/not-found" component={NotFound} />
        <Route path="/:slug" component={SlugRedirect} />
      </Switch>
    </QueryClientProvider>
  )
}

export default App
