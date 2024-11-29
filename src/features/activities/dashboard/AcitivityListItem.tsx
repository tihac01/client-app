import { Link } from "react-router-dom";
import {
  Item,
  Button,
  Segment,
  ItemContent,
  Icon,
  Label,
} from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
  activity: Activity;
}

export default observer(function ActivityListItem({ activity }: Props) {
  return (
    <Segment.Group>
      <Segment>
        {activity.isCanceled && (
          <Label
            attached="top"
            style={{ textAlign: "center" }}
            ribbon
            color="red"
            content="Canceled"
          />
        )}
        <Item.Group>
          <Item>
            <Item.Image
              style={{ marginBottom: 3 }}
              size="tiny"
              circular
              src={activity.host?.image || "/assets/user.png"}
            />
            <ItemContent>
              <Item.Header as={Link} to={`/activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by{" "}
                <Link to={`/profiles/${activity.hostUserName}`}>
                  {activity.host?.displayName}
                </Link>
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label basic color="orange">
                    Hosting
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label basic color="green">
                    Going
                  </Label>
                </Item.Description>
              )}
            </ItemContent>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name="clock" /> {format(activity.date!, "dd MMM yyyy HH:mm")}
          <Icon name="marker" /> {activity.venue}
        </span>
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
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
