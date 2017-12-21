import React, { Component } from 'react';
import {
  Container,
  Grid,
  // Header,
  // List,
  Segment,
} from 'semantic-ui-react';

export default class Footer extends Component {
  render() {
    return (
      <Segment inverted vertical style={{ marginTop: '3em', padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
    );
  }
}