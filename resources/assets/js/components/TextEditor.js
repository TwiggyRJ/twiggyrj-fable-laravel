import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Quill from 'quill';

export default class TextEditor extends Component {
  constructor(props) {
    super(props);
    
    this.state = {};

    this.editor;
  }

  componentDidMount() {
    this.editor = new Quill(`.quill-${this.props.id}`, this.props.config);

  }

  render() {
    return (
      <div className={`quill-${this.props.id}`}></div>
    );
  }
}

