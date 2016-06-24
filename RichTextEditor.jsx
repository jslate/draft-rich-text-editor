import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, ContentState, RichUtils, Entity, AtomicBlockUtils, Modifier, CompositeDecorator} from 'draft-js';
import classNames from 'classnames';
import _ from 'lodash';
import EmojiMenu from './EmojiMenu.jsx'
import LinkForm from './LinkForm.jsx'

class RichTextEditor extends React.Component {
  constructor(props) {
    window.RichUtils = RichUtils;
    window.EditorState = EditorState;
    super(props);
    const contentState = ContentState.createFromText(localStorage.getItem('myEditorContent') || '');


    const decorator = new CompositeDecorator([
      {
        strategy: this.findLinkEntities,
        component: this.Link,
      },
    ]);

    this.state = {
      emojiMenuVisible: false,
      linkFormVisible: false,
      editorState: EditorState.createWithContent(contentState, decorator)
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onStyleButtonClick = this.onStyleButtonClick.bind(this);
    this.onBoldClick = this.onBoldClick.bind(this);
    this.onItalicsClick = this.onItalicsClick.bind(this);
    this.onSmileyClick = this.onSmileyClick.bind(this);
    this.onLinkButtonClick = this.onLinkButtonClick.bind(this);
    this.doEmoji = this.doEmoji.bind(this);
    this.getButtonClassNames = this.getButtonClassNames.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.handleLinkFormSubmit = this.handleLinkFormSubmit.bind(this);
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

  onLinkButtonClick(event) {
    event.preventDefault();
    this.setState({linkFormVisible: !this.state.linkFormVisible});
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onEditorChange(newState);
      return true;
    }
    return false;
  }

  getButtonClassNames(checkForInlineStyle, extraClassNames = []) {
    return classNames(Object.assign({
      on: this.state.editorState.getCurrentInlineStyle().includes(checkForInlineStyle)
    }, _.fromPairs(extraClassNames.map((name) => [name, true]))));
  }

  doEmoji(event) {
    const contentState = Modifier.insertText(this.state.editorState.getCurrentContent(),
      this.state.editorState.getSelection(),
      event.target.textContent);

    this.setState({emojiMenuVisible: false});
    this.onEditorChange(EditorState.push(this.state.editorState, contentState, 'insert-characters'));
  }

  handleLinkFormSubmit(event, link) {
    const entityKey = Entity.create('LINK', 'MUTABLE', {url: link.url});


    // this.onEditorChange(EditorState.push(this.state.editorState, contentState, 'insert-characters'));

    let newEditorState = this.state.editorState;
    let newSelectionState;

    if (newEditorState.getSelection().isCollapsed()) {
      console.debug(`Inserting "${link.text}...`);
      const contentState = Modifier.insertText(newEditorState.getCurrentContent(),
        newEditorState.getSelection(),
        link.text);
      newEditorState = EditorState.push(newEditorState, contentState, 'insert-characters');
    } else {
      newSelectionState = SelectionStte.createEmtpy('string');

    }



    newEditorState = RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey);

    this.setState({editorState: newEditorState});
  }

  findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          Entity.get(entityKey).getType() === 'LINK'
        );
      },
      callback
    );
  }

  Link(props) {
    const {url} = Entity.get(props.entityKey).getData();
    return (
      <a href={url}>
        {props.children}
      </a>
    );
  }

  render() {
    return (
      <div>
        <div>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onEditorChange}
            ref="editor"
            />
        </div>
        <div>
          <a
            href="#"
            className={this.getButtonClassNames('BOLD')}
            onMouseDown={this.onBoldClick}
          >
            <img src="images/Bold.svg" style={{width: 20}} />
          </a>
          <a
            href="#"
            className={this.getButtonClassNames('ITALIC', ['i'])}
            onMouseDown={this.onItalicsClick}
          >
            <img src="images/Italic.svg" style={{width: 20}} />
          </a>
          <a href="#" onMouseDown={this.onSmileyClick}><img src="images/Emoji.svg" style={{width: 20}} /></a>
          <a href="#" onMouseDown={this.onLinkButtonClick}>
            <img src="images/link.svg" style={{width: 20}} />
          </a>
        </div>
        <LinkForm showLinkText={this.state.editorState.getSelection().isCollapsed()} visible={this.state.linkFormVisible} onSubmit={this.handleLinkFormSubmit} />
        <EmojiMenu onClick={this.doEmoji} visible={this.state.emojiMenuVisible} />
      </div>
    );
  }
}

const editorElement = document.getElementById('editor');
if (editorElement) {
  ReactDOM.render(
    <RichTextEditor />,
    document.getElementById('editor')
  );
}
