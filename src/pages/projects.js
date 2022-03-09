import React, { useEffect, useState } from "react";
import Sidebar from "../components/shared/sidebar";
import { Container, Col, Row } from "react-bootstrap";
import ProjectsList from "../components/parts/projectsList";

import * as datahandler from "../helpers/dataHandler";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectProgresses, setProjectProgresses] = useState([]);
  const [reloadCounter, reload] = useState(0);

  useEffect(() => {
    (async () => {
      const projects = await datahandler.show("projects");
      const users = [];
      for (let i = 0; i < projects?.length; i++) {
        for (let j = 0; j < projects[i].assigned_users.length; j++) {
          const user = projects[i].assigned_users[j];
          users.push(user);
        }
      }

      console.log(users, "===users");

      //Calculate project progresses
      const projectProgresses = [];
      for (let i = 0; i < projects.length; i++) {
        const done = [];
        let projectProgress = 0;
        for (let j = 0; j < projects[i].tasks.length; j++) {
          if (projects[i].tasks[j].status === "done") {
            done.push(projects[i].tasks[j]);
          }
        }
        if (done.length < 1) {
          projectProgresses.push(0);
          continue;
        }

        console.log(done.length, projects[i].tasks.length, "===difference");
        projectProgress = Math.round(
          (done.length / projects[i].tasks.length) * 100
        );
        projectProgresses.push(projectProgress);
      }

      setProjects(projects);
      setProjectProgresses(projectProgresses);
    })();
  }, [reloadCounter]);

  return (
    <div className="d-flex">
      <Container>
        <Row>
          <Col lg={12}>
            <h1>Projects</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ProjectsList
              projects={projects}
              projectProgresses={projectProgresses}
              reloadCounter={reloadCounter}
              reload={reload}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Projects;
