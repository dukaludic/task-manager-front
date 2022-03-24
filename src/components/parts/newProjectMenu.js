import React, { useState, useEffect, useContext } from "react";
import DropdownSearch from "./dropdownSearch";
import * as datahandler from "../../helpers/dataHandler";
import Auth from "../../context/AuthContext";

function NewProjectMenu(props) {
  const [allWorkers, setAllWorkers] = useState([]);
  const [allProjectManagers, setAllProjectManagers] = useState([]);
  const [newEntryAssignedUsers, setNewEntryAssignedUsers] = useState([]);
  const [newEntryProjectManager, setNewEntryProjectManager] = useState({});
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [newEntryStartDate, setNewEntryStartDate] = useState("");
  const [newEntryEndDate, setNewEntryEndDate] = useState("");
  const [newEntryDescription, setNewEntryDescription] = useState("");
  const [newEntryTitleValid, setNewEntryTitleValid] = useState(true);

  const authContext = useContext(Auth);

  useEffect(() => {
    (async () => {
      const users = await datahandler.show("users", authContext);

      const workers = [];
      const projectManagers = [];
      for (let i = 0; i < users.length; i++) {
        if (users[i].role === "project_manager") {
          projectManagers.push({
            _id: users[i]._id,
            title: `${users[i].first_name} ${users[i].last_name}`,
          });
        } else {
          workers.push({
            _id: users[i]._id,
            title: `${users[i].first_name} ${users[i].last_name}`,
          });
        }
      }

      console.log("workers", workers);
      setAllWorkers(workers);
      setAllProjectManagers(projectManagers);
    })();
  }, []);

  const addProject = async () => {
    if (newEntryTitle.length < 3) {
      setNewEntryTitleValid(false);
      return;
    }

    const assignedUsersIds = [];
    for (let i = 0; i < newEntryAssignedUsers.length; i++) {
      assignedUsersIds.push(newEntryAssignedUsers[i]._id);
    }

    const newProjectObj = {
      title: newEntryTitle,
      start_date: newEntryStartDate,
      end_date: newEntryEndDate,
      assigned_users: assignedUsersIds,
      project_manager_id: newEntryProjectManager._id,
      status: "to_do",
    };

    const newProjectRes = await datahandler.create(
      "projects",
      newProjectObj,
      authContext
    );
    props.setNewProjectMenuOpen(false);
  };

  const cancelNewProject = () => {
    setNewEntryTitle("");
    setNewEntryDescription("");
    setNewEntryAssignedUsers("");
    setNewEntryProjectManager("");
    setNewEntryStartDate("");
    setNewEntryEndDate("");
    props.setNewProjectMenuOpen(false);
  };

  return (
    <div>
      <div>
        <p>Title</p>
        <input
          value={newEntryTitle}
          onChange={(e) => setNewEntryTitle(e.target.value)}
          type="text"
          className=""
        />
        {!newEntryTitleValid && <p>Title must be at least 3 letter long</p>}
      </div>
      <div>
        <p>Description</p>
        <textarea
          value={newEntryDescription}
          onChange={(e) => setNewEntryDescription(e.target.value)}
        />
      </div>
      <div>
        <p>Team</p>
        <DropdownSearch
          style={{ display: "block" }}
          items={allWorkers}
          type="workers"
          setNewEntryAssignedUsers={setNewEntryAssignedUsers}
          newEntryAssignedUsers={newEntryAssignedUsers}
        />
      </div>
      <div>
        <p>Project Manager</p>
        <DropdownSearch
          items={allProjectManagers}
          type="project_managers"
          setNewEntryProjectManager={setNewEntryProjectManager}
        />
      </div>

      <div>
        <p>Start Date</p>
        <input
          value={newEntryStartDate}
          onChange={(e) => setNewEntryStartDate(e.target.value)}
          type="date"
          className=""
        />
      </div>

      <div>
        <p>End Date</p>
        <input
          value={newEntryEndDate}
          onChange={(e) => setNewEntryEndDate(e.target.value)}
          type="date"
          className=""
        />
      </div>
      <button onClick={addProject}>ADD</button>
      <button onClick={cancelNewProject}>Cancel</button>
    </div>
  );
}

export default NewProjectMenu;