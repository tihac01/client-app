import { Tab, TabPane } from "semantic-ui-react";
import ProfilePhotos from "./ProfilePhotos";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";

interface Props {
  profile: Profile;
}

export default observer(function ProfileContent({profile}: Props) {
  const panes = [
    {
      menuItem: "About",
      render: () => <TabPane>About Contnt</TabPane>,
    },
    {
      menuItem: "Photos",
      render: () => <ProfilePhotos profile={profile}/>,
    },
    {
      menuItem: "Events",
      render: () => <TabPane>Evebt Contnt</TabPane>,
    },
    {
      menuItem: "Followers",
      render: () => <TabPane>Folowers Contnt</TabPane>,
    },
    {
      menuItem: "Following",
      render: () => <TabPane>Folowing Contnt</TabPane>,
    },
  ];
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
    />
  );
});
