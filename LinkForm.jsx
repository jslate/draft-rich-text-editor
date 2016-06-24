import React from 'react';

class LinkForm extends React.Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {url: null, text: null};
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(event, {url: this.state.url, text: this.state.text});
  }

  renderTextField() {
    if (this.props.showLinkText) {
      return (<label>text: <input onChange={(event) => this.setState({text: event.target.value})} /></label>);
    }
    return null;
  }

  render() {
    if (this.props.visible) {
      return (
        <form className="link-form">
          {this.renderTextField()}
          <label>url: <input onChange={(event) => this.setState({url: event.target.value})} /></label>
          <button onClick={this.onFormSubmit}>Add link</button>
        </form>
      );
    } else {
      return null;
    }
  }

}

export default LinkForm;
