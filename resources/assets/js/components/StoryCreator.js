import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TextEditor from './TextEditor';
import { guid } from '../lib/identifiers';

export default class StoryCreator extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      content: [],
      contentLength: null,
    };

    this.addElement = this.addElement.bind(this);
  }

  addElement(toAdd) {
    let content = this.state.content.slice();
    if (toAdd === 'text') {
      content.push({ 
        type: 'text',
        content: '',
        config: {
          placeholder: 'Get those creative juices pumping!',
          theme: 'snow',
        },
        id: `${guid()}` 
      });
    } else if (toAdd === 'conversation') {
      content.push({
        type: 'conversation',
        content: '',
        config: {
          placeholder: 'Create some awesome dialog!',
          theme: 'bubble',
        },
        id: `${guid()}`
      });
    } else if (toAdd === 'interaction') {
      content.push({
        type: 'interaction',
        content: '',
        config: {
          placeholder: 'Create some awesome story development!',
          theme: 'snow',
        },
        id: `${guid()}`
      });
    } else if (toAdd === 'image') {
      content.push({ type: 'image', config: { size: 'l', src: '' }, id: `${guid()}` });
    }
    this.setState({content, contentLength: content.length});
  }

  render() {
    const { content } = this.state;
    let elements = [];

    if (content.length >= 1) {
      content.forEach((element) => {
        if (element.type === 'text') {
          elements.push(
            <div className="container">
              <div key={element.id} className="container-constrained m-auto story-text-block">
                <TextEditor id={element.id} config={element.config} />
              </div>
            </div>
          );
        } else if (element.type === 'image') {
          if (element.config.size === l) {
            elements.push(<img key={element.id} src={element.config.src} />);
          } else {
            elements.push(
              <div className="container">
                <div key={element.id} className="container-constrained m-auto">
                  <img src={element.config.src} />
                </div>
              </div>
            );
          }
        } else if (element.type === 'conversation') {
          elements.push(
            <div key={element.id} className="container-constrained m-auto">
              <p>conversation</p>
            </div>
          );
        } else if (element.type === 'interaction') {
          elements.push(
            <div key={element.id} className="story-interaction-block">
              <div className="container container-constrained m-auto">
                <p>interaction</p>
              </div>
            </div>
          );
        }
      });
    }

    return (
      <div className="relative">
        <div className="live-stage">
          { elements }
        </div>
        <div className="bg-white fixed toolbox-container">
          <div className="toolbox">
            <div className="toolbox-buttons">
              <button className="bg-blue p-20 text-left white" onClick={() => this.addElement('text')}>Add Text</button>
              <button className="bg-pink p-20 text-left white" onClick={() => this.addElement('conversation')}>Add Conversation</button>
              <button className="bg-magenta p-20 text-left white" onClick={() => this.addElement('interaction')}>Add Interaction</button>
              <button className="bg-purple p-20 text-left white" onClick={() => this.addElement('image')}>Add Image</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

if (document.getElementById('create-container')) {
  ReactDOM.render(<StoryCreator />, document.getElementById('create-container'));
}
