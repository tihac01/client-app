import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/sotre";
import ProfileActivityCard from "./ProfileActivityCard";
import { SyntheticEvent, useEffect } from "react";
import { Card, Grid, Header, Tab, TabPane, TabProps } from "semantic-ui-react";

interface Props {
  userName: string;
}

const panes = [
  { menuItem: "Future Events", pane: { key: "future" } },
  { menuItem: "Past Events", pane: { key: "past" } },
  { menuItem: "Hosting", pane: { key: "hosting" } },
];

export default observer(function ProfileActivities({ userName }: Props) {
  const {
    profileStore: { userActivities, loadUserActivities, loadingActivities },
  } = useStore();

  useEffect(() => {
    loadUserActivities(userName);
  }, [loadUserActivities, userName]);

  const handleTabChange = (_: SyntheticEvent, data: TabProps) => {
    loadUserActivities(userName, panes[data.activeIndex as number].pane.key);
  };

  return (
    <TabPane loading={loadingActivities}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="calendar" content={"Activities"} />
        </Grid.Column>
        <Grid.Column width="16">
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userActivities.map((activity) => (
              <ProfileActivityCard activity={activity} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </TabPane>
  );
});
