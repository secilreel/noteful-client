import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import UpdateNote from '../UpdateNote/UpdateNote';
// import dummyStore from '../dummy-store'
import { getNotesForFolder, findNote, findFolder } from '../notes-helpers'
import './App.css'
import config from '../config';
import NotefulContext from '../context';
require('dotenv').config();

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  setNotes = notes => {
    this.setState({
      notes,
      error: null,
    })
  }

  setFolders = folders => {
    this.setState({
      folders,
      error: null,
    })
  }

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/noteful`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setNotes)
      .catch(error => this.setState({ error }));
      
      fetch(`${config.API_ENDPOINT}/folder`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(res.status)
          }
          return res.json()
        })
        .then(this.setFolders)
        .catch(error => this.setState({ error }))
  };

  addNote = (note) => {
    this.setState({
      notes: [...this.state.notes, note] 
    })
  }

  addFolder = (folder) => {
    this.setState({
      folders: [...this.state.folders, folder]
    })
  }

  deleteNote = (id) =>{
    let newNotes=this.state.notes.filter(n=>n.id !== id);
    this.setState({
      notes: newNotes
    })
  }

  updateNote = (note) =>{
    let newNote=this.state.notes.find(n=> n.id == note.id)
    newNote.name=note.name
    newNote.content=note.content
    const stateCopy = [...this.state.notes]
    for (let i=0; i<stateCopy.length; i++){
      if(stateCopy[i].id == note.id) {
        stateCopy[i] = newNote;
      }
    }
    this.setState({
      notes: stateCopy
    })

  }
  
  renderNavRoutes() {
    const { notes, folders } = this.state
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={routeProps =>
              <NoteListNav
                {...routeProps}
                folders={folders}
                notes={notes}
              />
            }
          />
        )}
        <Route
          path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId) || {}
            const folder = findFolder(folders, note.folderId)
            return (
              <NotePageNav
                {...routeProps}
                folder={folder}
              />
            )
          }}
        />
        <Route
          path='/add-folder'
          component={NotePageNav}
        />
        <Route
          path='/add-note'
          component={NotePageNav}
        />
      </>
    )
  }

  renderMainRoutes() {
    const { notes, folders } = this.state
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={routeProps => {
              const { folderId } = routeProps.match.params
              const notesForFolder = getNotesForFolder(notes, folderId)
              return (
                <NoteListMain
                  {...routeProps}
                  notes={notesForFolder}
                />
              )
            }}
          />
        )}
        <Route
          exact path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId)
            return (
              <NotePageMain
                {...routeProps}
                note={note}
              />
            )
          }}
        />
        <Route
          exact path='/note/update/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId)
            return (
              <UpdateNote
                {...routeProps}
                note={note}
              />
            )
          }}
        />
        <Route
          path='/add-folder'
          component={AddFolder}
        />
        <Route
          path='/add-note'
          render={routeProps => {
            return (
              <AddNote
                {...routeProps}
                folders={folders}
              />
            )
          }}
        />
      </>
    )
  }

  render() {
    const contextValue={ 
      notes: this.state.notes,
      folders: this.state.folders,
      addNote: this.addNote, 
      addFolder: this.addFolder,
      deleteNote: this.deleteNote,
      updateNote: this.updateNote
    };
    return (
      <div className='App'>
        <NotefulContext.Provider value={contextValue}>
        <nav className='App__nav'>
          {this.renderNavRoutes()}
        </nav>
        <header className='App__header'>
          <h1>
            <Link to='/'>Noteful</Link>
            {' '}
            <FontAwesomeIcon icon='check-double' />
          </h1>
        </header>
        <main className='App__main'>
          {this.renderMainRoutes()}
        </main>
        </NotefulContext.Provider>  
      </div>
    )
  }
}

export default App
