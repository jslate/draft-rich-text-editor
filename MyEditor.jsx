import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, ContentState, RichUtils, Entity, AtomicBlockUtils, Modifier} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    window.RichUtils = RichUtils;
    window.EditorState = EditorState;
    super(props);
    const contentState = ContentState.createFromText(localStorage.getItem('myEditorContent') || '');
    this.state = {emojiMenuVisible: false, editorState: EditorState.createWithContent(contentState)};
    this.onChange = (editorState) => {
      this.setState({editorState}, () => {
        setTimeout(() => this.refs.editor.focus(), 0);
      });
      localStorage.setItem("myEditorContent", editorState.getCurrentContent().getPlainText());
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this._onBoldClick = this._onBoldClick.bind(this);
    this._onItalicsClick = this._onItalicsClick.bind(this);
    this._onSmileyClick = this._onSmileyClick.bind(this);
    this._doEmoji = this._doEmoji.bind(this);
    this.getButtonClassNames = this.getButtonClassNames.bind(this);
  }

  _onItalicsClick() {

    const toggle = RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC');
    this.onChange(toggle);
  }

  _onBoldClick() {
     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
   }

  _onSmileyClick() {
     this.setState({emojiMenuVisible: !this.state.emojiMenuVisible});
   }

   _doEmoji(event) {
      const contentState = Modifier.insertText(this.state.editorState.getCurrentContent(),
        this.state.editorState.getSelection(),
        event.target.textContent);

      this.setState({emojiMenuVisible: false});
      this.onChange(EditorState.push(this.state.editorState, contentState, 'insert-characters'));
   }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  renderEmojiMenuItem(emoji, index) {
    const br = (index + 1) % 24 === 0 ? <br /> : '';
    return <span key={index} onClick={this._doEmoji}>{emoji}{br}</span>;
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

  getButtonClassNames(checkForInlineStyle, extraClassNames) {
    if (this.state.editorState.getCurrentInlineStyle().includes(checkForInlineStyle)) {
      return ('on ' + extraClassNames);
    } else {
      return extraClassNames;
    }

  }

  render() {
    const {editorState} = this.state;
    return (
      <div>
        <div className="menu">
          <a href="#" className={this.getButtonClassNames('BOLD')} onClick={this._onBoldClick}>B</a><br />
          <a href="#" className={this.getButtonClassNames('ITALIC', 'i')} onClick={this._onItalicsClick}>I</a><br />
          <a href="#" onClick={this._onSmileyClick}><img src="smile.png" /></a><br />
        </div>
        <div className="ed">
          <Editor
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
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
