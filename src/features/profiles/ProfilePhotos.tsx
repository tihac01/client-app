import { observer } from "mobx-react-lite";
import {
  Card,
  Header,
  TabPane,
  Image,
  Grid,
  Button,
  ButtonGroup,
} from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/sotre";
import { SyntheticEvent, useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
  profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
  const {
    profileStore: {
      isCurrentUser,
      uploadPhoto,
      uploading,
      loading,
      setMainPhoto,
      deletePhoto,
    },
  } = useStore();
  const [addPhototMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

  function handlePhotoUpload(file: Blob) {
    uploadPhoto(file).then(() => setAddPhotoMode(false));
  }

  function handelSetMainPhoto(
    photo: Photo,
    e: SyntheticEvent<HTMLButtonElement>
  ) {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  }

  function handleDeletePhoto(id: string, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    deletePhoto(id);
  }

  return (
    <TabPane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon="image" content="Photos" floated="left" />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhototMode ? "Cancel" : "Add photo"}
              onClick={() => setAddPhotoMode(!addPhototMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhototMode ? (
            <PhotoUploadWidget
              uploadPhoto={handlePhotoUpload}
              uploading={uploading}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.photoId}>
                  <Image src={photo.url} />
                  {isCurrentUser && (
                    <ButtonGroup fluid widths={2}>
                      <Button
                        basic
                        color="green"
                        content="Main"
                        name={"main" + photo.photoId}
                        disabled={photo.isMain}
                        loading={target === "main" + photo.photoId && loading}
                        onClick={(e) => handelSetMainPhoto(photo, e)}
                      />
                      <Button
                        basic
                        color="red"
                        icon="trash"
                        name={photo.photoId}
                        disabled={photo.isMain}
                        onClick={(e) => handleDeletePhoto(photo.photoId, e)}
                        loading={target === photo.photoId && loading}
                      />
                    </ButtonGroup>
                  )}
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </TabPane>
  );
});
