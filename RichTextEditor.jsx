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

    this.state = {emojiMenuVisible: false, editorState: EditorState.createWithContent(contentState, decorator)};
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.onStyleButtonClick = this.onStyleButtonClick.bind(this);
    this.onBoldClick = this.onBoldClick.bind(this);
    this.onItalicsClick = this.onItalicsClick.bind(this);
    this.onSmileyClick = this.onSmileyClick.bind(this);
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
        <div className="menu">
          <a
            href="#"
            className={this.getButtonClassNames('BOLD')}
            onMouseDown={this.onBoldClick}
          >
            B
          </a><br />
          <a
            href="#"
            className={this.getButtonClassNames('ITALIC', ['i'])}
            onMouseDown={this.onItalicsClick}
          >
            I
          </a><br />
          <a href="#" onMouseDown={this.onSmileyClick}><img src="smile.png" /></a><br />
        </div>
        <div className="ed">
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onEditorChange}
            ref="editor"
            />
          <EmojiMenu onClick={this.doEmoji} visible={this.state.emojiMenuVisible} />
        </div>
        <LinkForm showLinkText={this.state.editorState.getSelection().isCollapsed()} onSubmit={this.handleLinkFormSubmit} />
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
