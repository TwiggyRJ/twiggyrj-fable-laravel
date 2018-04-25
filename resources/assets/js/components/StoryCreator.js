import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import shortid from 'shortid';
import TextEditor from './TextEditor';
import { guid } from '../lib/identifiers';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "none" : "none"
});



export default class StoryCreator extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      content: [],
      contentLength: null,
    };

    this.addElement = this.addElement.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onSetImageSize = this.onSetImageSize.bind(this);
  }

  addElement(toAdd) {
    let content = this.state.content.slice();
    if (toAdd === 'text') {
      content.push({
        id: shortid.generate(), 
        type: 'text',
        content: '',
        config: {
          placeholder: 'Get those creative juices pumping!',
          theme: 'snow',
        },
      });
    } else if (toAdd === 'dialog') {
      content.push({
        id: shortid.generate(),
        type: 'dialog',
        content: '',
        config: {
          placeholder: 'Create some awesome dialog!',
          theme: 'bubble',
        },
      });
    } else if (toAdd === 'interaction') {
      content.push({
        id: shortid.generate(),
        type: 'interaction',
        content: '',
        config: {
          placeholder: 'Create some awesome story development!',
          theme: 'snow',
        },
      });
    } else if (toAdd === 'image') {
      content.push({
        id: shortid.generate(),
        type: 'image',
        config: {
          size: 'l',
          class: '',
          file: null,
          src: 'http://www.ex-astris-scientia.org/observations/11001001/02a-11001001-r.jpg'
        },
      });
    }
    this.setState({content, contentLength: content.length});
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const content = reorder(
      this.state.content,
      result.source.index,
      result.destination.index
    );

    this.setState({
      content
    });
  }

  onSetImageSize(imageEl, size) {
    const { content } = this.state;
    const index = content.findIndex(item => item.id === imageEl);
    const item = content[index];

    item.config.size = size;
    item.config.class = (size === 's' ? 'container-constrained m-auto' : '');

    this.setState({content});
  }

  onGetImage(imageEl) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
    } else {
      alert('The File APIs are not fully supported in this browser.');
    }
  }

  render() {
    const { content } = this.state;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="relative">
          <div className="live-stage">
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {
                    content.map((element, index) => {
                      if (element.type === 'text') {
                        console.log('run')
                        return(
                          <Draggable key={element.id} draggableId={element.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <div className="container">
                                  <div key={element.id} className="container-constrained m-auto story-text-block">
                                    <TextEditor id={element.id} config={element.config} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      } else if (element.type === 'image') {
                        return(
                          <Draggable key={element.id} draggableId={element.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                className={`story-creator-p-item-container ${element.config.class}`}
                                key={element.id}>
                                <div className='story-creator-toolbelt'>
                                  <button onClick={() => console.log('Upload')}>
                                    <i className="fas fa-file-image"></i>
                                  </button>
                                  {
                                    element.config.size === 's' ?
                                      <button onClick={() => this.onSetImageSize(element.id, 'l')}>
                                        <i className="fas fa-expand"></i>
                                      </button>
                                    :
                                      <button onClick={() => this.onSetImageSize(element.id, 's')}>
                                        <i className="fas fa-compress"></i>
                                      </button>
                                  }
                                </div>
                                <div className='story-image'>
                                  <img
                                    src={element.config.src}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps} />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      } else if (element.type === 'dialog') {
                        return(
                          <Draggable key={element.id} draggableId={element.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                key={element.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <div className="container-constrained story-dialog-block m-auto">
                                  <p>dialog</p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      } else if (element.type === 'interaction') {
                        return(
                          <Draggable key={element.id} draggableId={element.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                key={element.id}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}>
                                <div className="story-interaction-block">
                                  <div className="container container-constrained m-auto">
                                    <TextEditor id={element.id} config={element.config} />
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      }
                    })
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="bg-white fixed toolbox-container">
            <div className="toolbox">
              <div className="toolbox-buttons">
                <button className="bg-blue p-20 text-left white" onClick={() => this.addElement('text')}>Add Text</button>
                <button className="bg-pink p-20 text-left white" onClick={() => this.addElement('dialog')}>Add Dialog</button>
                <button className="bg-magenta p-20 text-left white" onClick={() => this.addElement('interaction')}>Add Interaction</button>
                <button className="bg-purple p-20 text-left white" onClick={() => this.addElement('image')}>Add Image</button>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    );
  }
}

if (document.getElementById('create-container')) {
  ReactDOM.render(<StoryCreator />, document.getElementById('create-container'));
}
