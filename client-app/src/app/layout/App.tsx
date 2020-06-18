import React, {useEffect,Fragment, useContext} from 'react';
import { Container } from 'semantic-ui-react'
import { LoadingComponent } from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import NavBar from '../../features/nav/NavBar';

const App = () => {
  const activityStore = useContext(ActivityStore);
  
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <Fragment><LoadingComponent content='Loading Activities ...' /></Fragment>

  return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );

};

export default observer(App);
