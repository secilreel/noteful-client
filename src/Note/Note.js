import React, {Component}from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import config from '../config';
import NotefulContext from '../context';

export default class Note extends Component {
  
  static contextType = NotefulContext;
  
  deleteNoteRequest =(id) => {
    console.log(this.props)
    fetch(`${config.API_ENDPOINT}/note/${id}`,{
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
      },
    })
    .then(res =>{
      if(!res.ok) {
        throw new Error(res.status);
      }
    })
    .then(() => {
      this.context.deleteNote(id)
      this.props.history.push('/')
    })
    .catch(error => console.error({error}) );
  };
  
  render(){
  return (
    <div className='Note'>
      <h2 className='Note__title'>
        <Link to={`/note/${this.props.id}`} >
          {this.props.name}
        </Link>
      </h2>
      <button className='Note__delete' type='button' onClick={()=>this.deleteNoteRequest(this.props.id)}>
        <FontAwesomeIcon icon='trash-alt' />
        {' '}
        remove
      </button>
      <button className='Note__delete' type='button'>
      <Link to={`/note/update/${this.props.id}`} >
        {' '}
        update
      </Link>
      </button>
      <div className='Note__dates'>
        <div className='Note__dates-modified'>
          Modified
          {' '}
          <span className='Date'>
            {format(this.props.modified, 'Do MMM YYYY')}
          </span>
        </div>
      </div>
    </div>
  )
}
}