import {observable, action ,computed ,configure ,runInAction} from 'mobx' 
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ActivityStore{
    @observable activitiesRegistry = new Map();
    @observable activities: IActivity [] = [];
    @observable selectedActivity: IActivity|undefined; 
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate()
    {
        return Array.from(this.activitiesRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    @action loadActivities = async () => {
        
        this.loadingInitial = true;

        try{
            const activities = await agent.Activities.list();
            runInAction('loading activities',() =>{
                
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    //this.activities.push(activity);
                    this.activitiesRegistry.set(activity.id,activity);
                });
                
                this.loadingInitial = false;
            });
            
        } catch(error){

            console.log(error);

            runInAction('load activity error',() =>{
                this.loadingInitial = false;
            });
        }
    };

    @action selectActivity = (id: string) => {
        //this.selectedActivity = this.activities.find(a => a.id === id);
        this.selectedActivity = this.activitiesRegistry.get(id);
        this.editMode = false;
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try{
            await agent.Activities.create(activity);
            //this.activities.push(activity);
            runInAction('creating activity',() => {
                this.activitiesRegistry.set(activity.id,activity);
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction('create activity error',() => {
                this.submitting = false;
            });
            console.log(error);
        }
    };

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;        
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try{
            await agent.Activities.update(activity);
            //this.activities.push(activity);
            runInAction('editing activity',() => {
                this.activitiesRegistry.set(activity.id,activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction('edit activity error',() => {
                this.submitting = false;
            });

            console.log(error);
        }
    };

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activitiesRegistry.get(id);
        this.editMode = true;
    };

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined
    };

    @action cancelFormOpen = () => {
        this.editMode = false;
    };

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>,id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;

        try{
            await agent.Activities.delete(id);
            //this.activities.push(activity);
            runInAction('deleting activity',() => {
                this.activitiesRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            });
        } catch (error) {
            runInAction('delete activity error',() => {
                this.submitting = false;
                this.target = '';
            });
            
            console.log(error);
        }
    };
};

export default createContext(new ActivityStore());