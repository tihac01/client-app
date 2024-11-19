import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/sotre";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/loadingComponent";
import ActivityFilters from "./ActivityFilters";

export default observer(function ActivityDasshboard() {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry } = activityStore;

  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [loadActivities, activityRegistry.size]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading app"></LoadingComponent>;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
});
