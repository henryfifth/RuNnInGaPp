import React, { Component } from 'react';
import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Segment,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom'

export default class Homepage extends Component {
  render() {
    return (
      <div>
        <Segment
          inverted
          textAlign='center'
          style={{
            padding: '1em 0em',
            backgroundPosition: 'center',
            backgroundImage: 'url(https://images.unsplash.com/photo-1501621623639-dd7a3e2301f6?auto=format&fit=crop&w=675&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D)',
            backgroundSize: 'cover'
          }}
          vertical
        >
          <Container text style={{ paddingTop: '2em', paddingBottom: '2em' }}>
            <Header
              as='h1'
              content='Finish the race'
              inverted
              style={{ fontSize: '3em', fontWeight: 'normal', marginBottom: 0, marginTop: '1em' }}
            />
            <Header
              as='h2'
              content='Prepare to achieve your fitness dreams'
              inverted
              style={{ fontSize: '1.7em', fontWeight: 'normal' }}
            />
            <Button inverted as={Link} to="/login" size='large'>
              Get Started
                <Icon name='right arrow' />
            </Button>
          </Container>
        </Segment>
        <Container textAlign='center' style={{ paddingTop: '2em', paddingBottom: '2em' }}>
          <Icon name='map' size="huge" fitted />
          <Header as='h2' icon textAlign='center'>
            Find local routes
        </Header>
          <p style={{ fontSize: '1.33em' }}>
            Find new routes that people in your area have already run or create your own
          </p>
          <Divider horizontal />
          <Icon name='trophy' size="huge" fitted />
          <Header as='h2' icon textAlign='center'>
            Achieve your fitness goals
        </Header>
          <p style={{ fontSize: '1.33em' }}>
            Keep track of your running and achieve your fitness goals.
          </p>
        </Container>
      </div>
    );
  }
}