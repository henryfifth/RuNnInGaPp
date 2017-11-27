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
            Find local favorites
        </Header>
          <p style={{ fontSize: '1.33em' }}>
            Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but it's really
              true.
              It took years of gene splicing and combinatory DNA research, but our bananas can really dance.
            </p>
          <Button basic as={Link} to="/about" size='large'>I'm Still Quite Interested</Button>
          <Divider horizontal />
          <Icon name='trophy' size="huge" fitted />
          <Header as='h2' icon textAlign='center'>
            Complete your fitness goals
        </Header>
          <p style={{ fontSize: '1.33em' }}>
            Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but it's really
              true.
              It took years of gene splicing and combinatory DNA research, but our bananas can really dance.
            </p>
          <Button basic as={Link} to="/about" size='large'>I'm Still Quite Interested</Button>
        </Container>
      </div>
    );
  }
}