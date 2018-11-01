import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import shortid from 'shortid';
import TextEditor from './TextEditor';
import PageCreator from './PageCreator';
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
      story: {
        title: 'Story Title',
        description: 'Story Description',
      },
      pages: [{
        id: shortid.generate(),
        type: '',
        sections: [{
          id: shortid.generate(),
          type: 'header',
          content: {
            title: 'Page 1',
            subtitle: '',
            background: null,
          },
          config: {
            placeholder: {
              title: 'Lets Create!',
              subtitle: 'This could be a story recap or intro to what is to come, You decide!',
            },
          },
        }],
        save: this.savePage,
        config: {
          first: true,
          last: false,
          gameOver: false,
          order: 1,
          linksTo: [],
        },
      }],
      pagesLength: null,
    };

    this.addPage = this.addPage.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.savePage = this.savePage.bind(this);
  }

  addPage(toAdd) {
    let pages = this.state.pages.slice();
    pages.push({
      id: shortid.generate(),
      type: '',
      sections: [{
        id: shortid.generate(),
        type: 'header',
        content: {
          title: '',
          subtitle: '',
          background: null,
        },
        config: {
          placeholder: {
            title: 'Lets Create!',
            subtitle: 'This could be a story recap or intro to what is to come, You decide!',
          },
        },
      }],
      save: this.savePage,
      config: {
        first: false,
        last: false,
        gameOver: false,
        order: pages.length,
        linksTo: [],
      },
    });
    this.setState({pages, pagesLength: pages.length});
  }

  savePage(id, content) {
    const { pages } = this.state;
    const index = content.findIndex(item => item.id === id);
    const item = pages[index];

    item.content = content;
    pages[index] = item;

    this.setState({ page });
  }

  createPage() {
    
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const page = reorder(
      this.state.page,
      result.source.index,
      result.destination.index
    );

    this.setState({
      page
    });
  }

  render() {
    const { pages } = this.state;
    return [
      <header className="full bg-blue">
        <section className="landing-header p-100">
          <textarea className="text-center white pb-50 header-title page-title-input" placeholder={this.state.story.title} value={this.state.story.title} onChange={e => console.log(e.target.value)} />
          <span className="block header-divider pt-20 mb-20"></span>
          <textarea className="text-center white header-paragraph page-description-input" placeholder={this.state.story.description} value={this.state.story.description} onChange={e => console.log(e.target.value)} />
        </section>
        <div className="story-creator-toolbelt-generic-tools">
          <button onClick={() => console.log('image')}>
            <i className="fas fa-file-image"></i>
          </button>
        </div>
      </header>,
      <section>
        <div>
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
                        pages.map((page, index) => {
                          console.log(page)
                          return (
                            <div className="story-creator-card story-creator-new-page-card" onClick={() => this.createPage()}>
                              <p>+ New Page</p>
                            </div>
                          )
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
                    <button className="bg-blue p-20 text-left white" onClick={() => this.addPage()}>Add Page</button>
                    <button className="bg-pink p-20 text-left white" onClick={() => console.log('character')}>Add Character</button>
                    <button className="bg-magenta p-20 text-left white" onClick={() => this.addElement('interaction')}>Add Interaction</button>
                    <button className="bg-purple p-20 text-left white" onClick={() => this.addElement('image')}>Add Image</button>
                  </div>
                </div>
              </div>
            </div>
          </DragDropContext>
        </div>
      </section>
    ];
  }
}

if (document.getElementById('create-container')) {
  ReactDOM.render(<StoryCreator />, document.getElementById('create-container'));
}
