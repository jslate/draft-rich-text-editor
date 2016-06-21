import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, ContentState, RichUtils, Entity, AtomicBlockUtils, Modifier} from 'draft-js';
import classNames from 'classnames';
import _ from 'lodash';

class MyEditor extends React.Component {
  constructor(props) {
    window.RichUtils = RichUtils;
    window.EditorState = EditorState;
    super(props);
    const contentState = ContentState.createFromText(localStorage.getItem('myEditorContent') || '');
    this.state = {emojiMenuVisible: false, editorState: EditorState.createWithContent(contentState)};
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onStyleButtonClick = this.onStyleButtonClick.bind(this);
    this.onBoldClick = this.onBoldClick.bind(this);
    this.onItalicsClick = this.onItalicsClick.bind(this);
    this.onSmileyClick = this.onSmileyClick.bind(this);
    this.doEmoji = this.doEmoji.bind(this);
    this.getButtonClassNames = this.getButtonClassNames.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  onEditorChange(editorState) {
    this.setState({editorState: editorState});
    localStorage.setItem("myEditorContent", editorState.getCurrentContent().getPlainText());
  }

  onStyleButtonClick(event, style) {
    event.preventDefault();
    this.onEditorChange(RichUtils.toggleInlineStyle(this.state.editorState, style));
  }

  onItalicsClick(event) { this.onStyleButtonClick(event, 'ITALIC'); }

  onBoldClick(event) { this.onStyleButtonClick(event, 'BOLD'); }

  onSmileyClick(event) {
    event.preventDefault();
    this.setState({emojiMenuVisible: !this.state.emojiMenuVisible});
  }

  doEmoji(event) {
    event.preventDefault();
    const contentState = Modifier.insertText(this.state.editorState.getCurrentContent(),
      this.state.editorState.getSelection(),
      event.target.textContent);

    this.setState({emojiMenuVisible: false});
    this.onEditorChange(EditorState.push(this.state.editorState, contentState, 'insert-characters'));
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onEditorChange(newState);
      return true;
    }
    return false;
  }

  renderEmojiMenuItem(emoji, index) {
    const br = (index + 1) % 24 === 0 ? <br /> : '';
    return <span key={index} onMouseDown={this.doEmoji}>{emoji}{br}</span>;
  }

  renderEmojiMenu() {
    if (this.state.emojiMenuVisible) {
      const emoji = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀', '🙅', '🙆', '🙇', '🙈', '🙉', '🙊', '🙋'];
      const emojiMenuItems = emoji.map((e, i) => {
        return this.renderEmojiMenuItem(e, i);
      });
      return (<div className="emoji-menu">{emojiMenuItems}</div>);
    } else {
      return null;
    }
  }

  getButtonClassNames(checkForInlineStyle, extraClassNames = []) {
    return classNames(Object.assign({
      on: this.state.editorState.getCurrentInlineStyle().includes(checkForInlineStyle)
    }, _.fromPairs(extraClassNames.map((name) => [name, true]))));
  }

  render() {
    return (
      <div>
        <div className="menu">
          <a href="#" className={this.getButtonClassNames('BOLD')} onMouseDown={this.onBoldClick}>B</a><br />
          <a href="#" className={this.getButtonClassNames('ITALIC', ['i'])} onMouseDown={this.onItalicsClick}>I</a><br />
          <a href="#" onMouseDown={this.onSmileyClick}><img src="smile.png" /></a><br />
        </div>
        <div className="ed">
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onEditorChange}
            ref="editor"
            />
          {this.renderEmojiMenu()}
        </div>
      </div>
    );
  }
}

const editorElement = document.getElementById('editor');
if (editorElement) {
  ReactDOM.render(
    <MyEditor />,
    document.getElementById('editor')
  );
}
