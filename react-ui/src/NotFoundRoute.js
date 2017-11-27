import React, { Component } from 'react'

export default class NotFoundRoute extends Component {
  render() {
    console.log('This is the 404 page')
    return (
      <div>
        <h1>Arrgghh Matey! The Url ye requested ain't heeeerrrre</h1>
      </div>
    )
  }
}