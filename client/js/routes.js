const React = require("react");
const { Route, IndexRoute } = require("react-router");
const actions = require("./actions/login-actions");
const axios = require("axios");

const App = require("./components/App");
const Home = require("./components/Home");
const Polls = require("./components/Polls");
const Poll = require("./components/Poll");
const Login = require("./components/Login");
const Register = require("./components/Register");
const User = require("./components/User");
const Logout = require("./components/Logout");
const NotFound = require("./components/NotFound");

const wrapStoreToRoutes = function(store) {

  const requireAuth = function(nextState, replaceState) {
    const state = store.getState();

    if(state.user === null) {
      replaceState({ pathname: "/login" });
    }
  };

  const delegateAuth = function(nextState, replaceState) {
    const state = store.getState();

    if(state.user) {
      replaceState({ pathname: "/user/" + state.user.username });
    }
  };

  const logout = function(nextState, replaceState) {
    const state = store.getState();

    if(state.user) {
      axios.post("/api/logout", {})
      .then(() => { return 0; })
      .catch(console.log);

      store.dispatch(actions.logout());
      replaceState({ pathname: "/login" });
    }
    else {
      replaceState({ pathname: "/login" });
    }
  };

  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/polls" component={Polls}/>
      <Route path="/polls/:pollId" component={Poll}/>
      <Route path="/login" component={Login} onEnter={delegateAuth}/>
      <Route path="/register" component={Register} onEnter={delegateAuth}/>
      <Route path="/user/:username" component={User} onEnter={requireAuth}/>
      <Route path="/logout" component={Logout} onEnter={logout}/>
      <Route path="*" component={NotFound}/>
    </Route>
  );
};

module.exports = wrapStoreToRoutes;
