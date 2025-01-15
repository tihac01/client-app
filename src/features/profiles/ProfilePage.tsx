import { observer } from "mobx-react-lite";
import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/sotre";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/loadingComponent";

export default observer(function ProfilePage() {
  const { userName } = useParams();
  const { profileStore } = useStore();
  const { loadProfile, profile, loadingProfile, setActiveTab } = profileStore;

  useEffect(() => {
    if (userName) loadProfile(userName);
    return () => {
      setActiveTab(0);
    }
  }, [loadProfile, userName, setActiveTab]);

  if (loadingProfile) return <LoadingComponent content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});
