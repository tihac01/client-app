import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/sotre";
import { Container, Header, Segment } from "semantic-ui-react";

export default observer(function ServerError() {
  const { commonStore } = useStore();

  return (
    <Container>
      <Header as="h1" content="Server Error" />
      <Segment color="red">
        <Header as="h3" color="red" content={commonStore.error?.message} />
      </Segment>
      {commonStore.error?.details && (
        <Segment>
          <Header as="h4" content="Stack race" color="teal" />
          <code style={{ marginTop: "10px" }}>{commonStore.error.details}</code>
        </Segment>
      )}
    </Container>
  );
});
