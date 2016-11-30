const React = require("react");
const { connect } = require("react-redux");
const { Grid, Row, Col, Button, Form, FormGroup, FormControl, ControlLabel, Checkbox } = require("react-bootstrap");

const LoginButton = require("./AuthButton");
const actions = require("../actions/login-actions");

function pretendLogin(path, creds, cb) {
  const user = require("../dev/sampleAccount");

  if(creds.email === "example@email.com" && creds.password === "pass1") {
    setTimeout(cb, 1000, null, user);
  }
  else if(creds.email === "" && creds.password === "") {
    setTimeout(cb, 1000, null, user);
  }
  else {
    setTimeout(cb, 1000, { message: "invalid username or password" }, null);
  }
}

const EmailForm = React.createClass({
  propTypes: {
    isOpen: React.PropTypes.bool.isRequired,
    email: React.PropTypes.string.isRequired,
    password: React.PropTypes.string.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    reqPending: React.PropTypes.bool.isRequired,
    errmsg: React.PropTypes.object
  },
  onSubmit: function(e) {
    this.props.handleSubmit(e, this.props.email, this.props.password);
  },
  render: function() {
    return (
      <div className={this.props.isOpen ? "panel show" : "panel"}>
        <Form horizontal onSubmit={this.onSubmit}>

          <FormGroup controlId="nativeEmail">
            <Col componentClass={ControlLabel} sm={2}>
              Email
            </Col>
            <Col sm={10}>
              <FormControl type="email" placeholder="Email" value={this.props.email} onChange={this.props.handleChange}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="nativePassword">
            <Col componentClass={ControlLabel} sm={2}>
              Password
            </Col>
            <Col sm={10}>
              <FormControl type="password" placeholder="Password" value={this.props.password} onChange={this.props.handleChange}/>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={10} smOffset={2}>
              <Checkbox>Remember Me</Checkbox>
            </Col>
          </FormGroup>

          <FormGroup>
            <Col sm={10} smOffset={2}>
              <Button type="submit" className="login-btn">Login</Button>
              {this.props.reqPending ? <i className="fa fa-spinner fa-spin"></i> : null}
              {this.props.errmsg ? <span className="error-msg">{this.props.errmsg.message}</span> : null}
            </Col>
          </FormGroup>

        </Form>
      </div>
    );
  }
});

const Login = React.createClass({
  propTypes: {
    emailOpen: React.PropTypes.bool.isRequired,
    email: React.PropTypes.string.isRequired,
    password: React.PropTypes.string.isRequired,
    handleChange: React.PropTypes.func.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    toggleEmailForm: React.PropTypes.func.isRequired,
    login: React.PropTypes.func.isRequired,
    reqPending: React.PropTypes.bool.isRequired,
    errmsg: React.PropTypes.object
  },
  render: function() {
    return (
      <Grid fluid className="container-aug">
        <Row>
          <Col md={4} sm={6} xs={8} mdOffset={4} smOffset={3} xsOffset={2}>
            <LoginButton id="emailLogin" onClick={this.props.toggleEmailForm}>
              Log in with Email
            </LoginButton>
            <EmailForm
              isOpen={this.props.emailOpen}
              email={this.props.email}
              password={this.props.password}
              handleChange={this.props.handleChange}
              handleSubmit={this.props.handleSubmit}
              reqPending={this.props.reqPending}
              errmsg={this.props.errmsg}
            />
            <LoginButton id="github" onClick={this.props.login}>Login with Github</LoginButton>
            <LoginButton id="twitter" onClick={this.props.login}>Login with Twitter</LoginButton>
          </Col>
        </Row>
      </Grid>
    );
  }
});

const mapStateToProps = function(state) {
  return {
    emailOpen: state.login.login.emailOpen,
    email: state.login.emailForm.email,
    password: state.login.emailForm.password,
    reqPending: state.login.reqPending,
    errmsg: state.login.err
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    toggleEmailForm: function() {
      dispatch(actions.toggleEmailForm());
    },
    login: function() {
      //noop (event object as argument)
      //handle login with social media here
    },
    handleChange: function(e) {
      switch(e.target.id) {
        case "nativeEmail":
          dispatch(actions.updateInput(e.target.value, "email"));
          break;

        case "nativePassword":
          dispatch(actions.updateInput(e.target.value, "password"));
          break;
      }
      return false;
    },
    handleSubmit: function(e, email, password) {
      e.preventDefault();
      dispatch(actions.requestLogin());

      var creds = {
        email: email,
        password: password
      };

      pretendLogin("../dev/sampleAccount", creds, function(err, user) {
        if(err) {
          dispatch(actions.loginFailure(err));
          return;
        }
        dispatch(actions.loginSuccess(user));
        ownProps.router.push("/user/" + user.id);
      });
    }
  };
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

module.exports = LoginContainer;
