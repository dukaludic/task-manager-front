import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
} from "react";

import { Auth } from "../../context/AuthContext";

import * as datahandler from "../../helpers/dataHandler";

const ProjectSingleTeamDropdown = forwardRef((props, ref) => {
  const authContext = useContext(Auth);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    (async () => {
      const projectUsers = props.data;

      const allUsers = await datahandler.show("users");

      const allWorkersRepack = allUsers
        .filter((user) => user.role === "worker")
        .map((user) => {
          return {
            _id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            username: user.username,
            email: user.email,
            role: user.role,
            profile_picture: user.profile_picture,
          };
        });

      console.log(allWorkersRepack, "allworkersRepack");

      //difference between arrays because some are already assigned and shouldn't appear in search
      const remainingUsers = allWorkersRepack.filter(
        ({ _id }) =>
          !props.assignedUsers.some((user) => {
            console.log(user._id);
            if (user._id === _id) return user;
          })
      );

      console.log(
        remainingUsers,
        props.assignedUsers,
        "remainingUsers and assignedUsers"
      );

      console.log(data, "dataaa");

      setData(remainingUsers);
      // console.log(props.data, "props.data");
    })();
  }, []);

  const onInput = (e) => {
    console.log(data, e.target.value, "data");
    const filtered = data?.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log(filtered, "filtered");
    setFiltered(filtered);
    setSearch(e.target.value);
  };

  const onFocus = (e) => e.target.parentNode.parentNode.classList.add("focus");
  const onBlur = (e) =>
    e.target.parentNode.parentNode.classList.remove("focus");

  const onClickItem = async (item) => {
    // console.log(props.setAssignedUsers);

    props.setParentData([...props.assignedUsers, item]);

    const assignedUsersIds = [...props.assignedUsers, item].map((el) => el._id);

    console.log(assignedUsersIds, "assignedUsers");

    if (props.type === "project") {
      const updatedProject = await datahandler.update(
        "projects",
        props.project._id,
        {
          assigned_users: assignedUsersIds,
        },
        authContext
      );
    }

    setData((prevState) => prevState.filter((user) => user._id !== item._id));
    setFiltered([]);
  };

  useImperativeHandle(ref, () => ({
    setData: setData,
  }));

  return (
    <div>
      <div className="wrapper">
        <div className="search">
          <input
            _id="search"
            type="search"
            value={search}
            onChange={onInput}
            onFocus={onFocus}
            onBlur={onBlur}
            autoComplete="off"
          />
        </div>
        {search.length > 1 && filtered.length > 0 && (
          <ul className=".dropdown-search-list">
            {filtered.map((item) => (
              <li onClick={() => onClickItem(item)}>{item.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

export default ProjectSingleTeamDropdown;
