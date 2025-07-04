import { Route, Switch } from "wouter";
import Home from './pages/home'
import NotFound from './pages/NotFound'
import SlugRedirect from './pages/SlugRedirect'

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/not-found" component={NotFound} />
      <Route path="/:slug" component={SlugRedirect} />
    </Switch>
  )
}

export default App
