import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import * as datahandler from "../../helpers/dataHandler";

function DropdownSearch({
  items,
  type,
  setNewEntryProject,
  setNewEntryAssignedUsers,
  setNewEntryProjectManager,
  newEntryAssignedUsers,
  newEntryProjectManager,
  setProjectManager,
}) {
  const [data, setData] = useState(items);
  const [search, setSearch] = useState("");
  const [project, setProject] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [assignedUserHovered, setAssignedUserHovered] = useState(null);

  console.log(items, "props.items dropdown");

  const [team, setTeam] = useState([]);

  useEffect(() => {
    console.log(items, "items dropdown");
    setData(items);
  }, [items]);

  //   const onInput = (e) => setSearch(e.target.value);
  // const onFocus = (e) => e.target.parentNode.parentNode.classList.add("focus");
  // const onBlur = (e) =>
  //   e.target.parentNode.parentNode.classList.remove("focus");

  const onInput = (e) => {
    console.log(type, "===============================");
    console.log("input");
    const filtered = data?.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
    console.log(filtered, "filtered");
    setFiltered(filtered);
    setSearch(e.target.value);
  };

  window.onclick = () => {
    setFiltered([]);
  };

  const onClickItem = async (item, type) => {
    console.log(item, type, filtered, "===============================");

    switch (type) {
      case "projects":
        setSearch(item.title);
        setNewEntryProject(item);
        setFiltered([]);
        break;
      case "workers":
        setNewEntryAssignedUsers([...newEntryAssignedUsers, item]);
        const tmpData = data.filter((el) => el.title !== item.title);

        console.log(tmpData, "tmpData");
        setData(tmpData);
        setFiltered([]);
        break;
      case "project_managers":
        console.log(type);
        console.log(item.title, "item title");
        setSearch(item.title);
        setNewEntryProjectManager(item);
        setFiltered([]);
        break;

      default:
        break;
    }
  };

  const removeTeamMember = (item) => {
    const tmpTeam = newEntryAssignedUsers.filter(
      (el) => el.title !== item.title
    );

    console.log(tmpTeam, "===tmpTeam");
    setNewEntryAssignedUsers(tmpTeam);
    setData([...data, item]);
    // console.log([...data, tmpTeam[index]]);
  };

  return (
    <div>
      <div>
        <div className="">
          <input
            className="input-default b-2"
            _id=""
            value={search}
            onChange={onInput}
            // onFocus={onFocus}
            // onBlur={onBlur}
            autoComplete="off"
          />
        </div>
        {search.length > 1 && filtered.length > 0 && (
          <ul
            style={{ maxHeight: filtered.length > 0 ? "100px" : "0px" }}
            className="dropdown-search-list"
          >
            {filtered.map((item) => (
              <li onClick={() => onClickItem(item, type)}>{item.title}</li>
            ))}
          </ul>
        )}
      </div>

      {newEntryAssignedUsers?.map((item, i) => {
        {
          console.log(item);
        }
        return (
          <div className="d-flex">
            <span>{item.title}</span>
            <span>
              <AiOutlineClose onClick={() => removeTeamMember(item)} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default DropdownSearch;
