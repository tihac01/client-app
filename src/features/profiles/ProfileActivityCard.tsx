import { observer } from "mobx-react-lite";
import { Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { UserActivity } from "../../app/models/profile";
import { format } from "date-fns";

interface Props {
  activity: UserActivity;
}

export default observer(function ProfileActivityCard({ activity }: Props) {
  return (
    <Card as={Link} to={`/activities/${activity.activityId}`}>
      <Image
        src={`/assets/categoryImages/${activity.category}.jpg`}
        style={{ minHeight: 100, objectFit: "cover" }}
      />
      <Card.Content>
        <Card.Header textAlign="center">{activity.title}</Card.Header>
        <Card.Meta textAlign="center">
          <div>{format(new Date(activity.date), "do LLLL")}</div>
          <div>{format(new Date(activity.date), "h:mm a")}</div>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
});
