import React from 'react';

class EmojiMenu extends React.Component {
  constructor(props) {
    super(props);
    this.onEmojiClick = this.onEmojiClick.bind(this);
  }

  onEmojiClick(event) {
    event.preventDefault();
    this.props.onClick(event);
  }

  renderEmojiMenuItem(emoji, index) {
    const br = (index + 1) % 24 === 0 ? <br /> : '';
    return <span key={index} onMouseDown={this.onEmojiClick}>{emoji}{br}</span>;
  }

  render() {
      if (this.props.visible) {
        const emoji = ['😀', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😈', '😉', '😊', '😋', '😌', '😍', '😎', '😏', '😐', '😑', '😒', '😓', '😔', '😕', '😖', '😗', '😘', '😙', '😚', '😛', '😜', '😝', '😞', '😟', '😠', '😡', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩', '😪', '😫', '😬', '😭', '😮', '😯', '😰', '😱', '😲', '😳', '😴', '😵', '😶', '😷', '😸', '😹', '😺', '😻', '😼', '😽', '😾', '😿', '🙀', '🙅', '🙆', '🙇', '🙈', '🙉', '🙊', '🙋'];
        const emojiMenuItems = emoji.map((e, i) => {
          return this.renderEmojiMenuItem(e, i);
        });
        return (<div className="emoji-menu">{emojiMenuItems}</div>);
      } else {
        return null;
      }
  }

}

export default EmojiMenu;
