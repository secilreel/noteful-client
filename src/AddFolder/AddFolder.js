import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddFolder.css'
import config from '../config';
import NotefulContext from '../context';

export default class AddFolder extends Component {
  constructor(props){
    super(props)
    this.state = {
    name: ''
  }
}

  static contextType = NotefulContext;

  setName(name){
    this.setState({name})
  };

  handleSubmit =(e) => {
    e.preventDefault();
    const newFolder={
      name: this.state.name,
    };
    fetch(`${config.API_ENDPOINT}/folder`,{
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
      },
      body: JSON.stringify(newFolder),
    })
    .then(res =>{
      if(res.ok) {
        return res.json()}
      else  throw new Error(res.status);
      })
    .then(folder => {
      this.context.addFolder(folder)
      this.props.history.push('/')
    })
    .catch(error => console.error({error}) );
  };

  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' onChange={(e)=> this.setName(e.target.value)}/>
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
