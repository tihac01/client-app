import {
  Button,
  Container,
  Dropdown,
  Image,
  Menu,
  MenuItem,
} from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../stores/sotre";

export default observer(function NavBar() {
  const {
    userStore: { user, logout },
  } = useStore();
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to="/" header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" />
        <Menu.Item as={NavLink} to="/errors" name="errors" />
        <Menu.Item>
          <Button
            as={NavLink}
            to="/createActivity"
            positive
            content="Create Activity"
          ></Button>
        </Menu.Item>
        <MenuItem position="right">
          <Image
            src={user?.image || "/assets/user.png"}
            avatar
            spaced="right"
          />
          <Dropdown pointing="top left" text={user?.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to={`/profiles/${user?.userName}`}
                text="My Profile"
                icon="user"
              />
              <Dropdown.Item onClick={logout} text="Logout" icon="power" />
            </Dropdown.Menu>
          </Dropdown>
        </MenuItem>
      </Container>
    </Menu>
  );
});
