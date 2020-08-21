import React, { Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  render() {
    return (
      <Router>
        <div>
          <h1
            style={{ color: '#61dafb' }}
            onClick={() => this.setState({ count: this.state.count + 1 })}
          >
            Hello React:{this.state.count}!
          </h1>
          <img
            height="300"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
          />
          <h1>React Router Test</h1>
          <nav>
            <ul>
              <li>
                <Link to="/react">Home</Link>
              </li>
              <li>
                <Link to="/react/about">About</Link>
              </li>
              <li>
                <Link to="/react/users">Users</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/react/about">
              <About />
            </Route>
            <Route path="/react/users">
              <Users />
            </Route>
            <Route path="/react">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

function Home() {
  return <h2>Home</h2>
}
function About() {
  return <h2>About</h2>
}
function Users() {
  return <h2>Users</h2>
}

export default App
