import { Link } from "react-router-dom";
import {
  Item,
  Button,
  Segment,
  ItemGroup,
  ItemContent,
  Icon,
} from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";

interface Props {
  activity: Activity;
}

export default observer(function ActivityListItem({ activity }: Props) {
  return (
    <Segment.Group>
      <Segment>
        <ItemGroup>
          <Item>
            <Item.Image size="tiny" circular src="/assets/user.png" />
            <ItemContent>
              <Item.Header
                as={Link}
                to={`/activities/${activity.id}`}
              ></Item.Header>
              <Item.Description>Hosted by Bob</Item.Description>
            </ItemContent>
          </Item>
        </ItemGroup>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy HH:mm")}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>Atendees go here</Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          color="teal"
          floated="right"
          content="View"
        />
      </Segment>
    </Segment.Group>
  );
});
