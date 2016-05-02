import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    const {editorState} = this.state;
    return (
      <div class="ed">
        <Editor editorState={editorState} onChange={this.onChange} />
        <hr />
        <h3>Preview</h3>
        <div>{this.state.editorState.getCurrentContent().getPlainText()}</div>
      </div>
    );
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('editor')
);
