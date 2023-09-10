import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Avatar, Image } from "antd";

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 5px 5px 5px 2px grey;
  padding: 8px;
  color: #000;
  margin-bottom: 8px;
  min-height: 90px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => bgcolorChange(props)};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
  display: flex;
  flex-direction:column;
  align-items:flex-end;
  padding: 2px;
  gap:2px;
`;
function bgcolorChange(props) {
  return props.isDragging
    ? "lightgreen"
    : props.isDraggable
      ? props.isBacklog
        ? "#F2D7D5"
        : "#DCDCDC"
      : props.isBacklog
        ? "#F2D7D5"
        : "#EAF4FC";
}

export default function Task({ task, index, deleteTodo, notifyUpdate }) {
  return (
    <Draggable draggableId={task._id} key={task._id} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div style={{ padding: "1.2rem" }}>
            <div style={{ textAlign: "left", fontSize: "1.2rem", fontWeight: "medium" }}>{task.title}</div>
            <div style={{ textAlign: "left", fontSize: "0.9rem" }}>{task.description}</div>
          </div>
          <Icons>
            <div onClick={() => notifyUpdate(task)}>
              update
            </div>
            <div onClick={() => deleteTodo(task._id)}>
              delete
            </div>
          </Icons>
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}