/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useLocation, useParams } from "react-router-dom";
import { PostAnyApi, getWithoutAuth } from "../../api/api";
import { useDispatch } from "react-redux";
import { toogleLoading } from "../../store/store";

function AdminInterface() {
  // Sample user data
  const [trigger, setTrigger] = useState();

  const [userList, setUserList] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toogleLoading());
    getWithoutAuth("admin/all").then((res) => {
      setUserList(res.data);
      dispatch(toogleLoading());
    });
  }, [trigger]);

  // Callback function for when an item is dragged and dropped
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const updatedUserList = [...userList];
    const [reorderedUser] = updatedUserList.splice(result.source.index, 1);
    updatedUserList.splice(result.destination.index, 0, reorderedUser);

    const newPosition = result.destination.index + 1; 

    console.log(
      `User ${reorderedUser.position} was moved to position ${
        userList[newPosition - 1].position
      }`
    );

    PostAnyApi("admin/update",{newPosition :userList[newPosition - 1  ].position, userId: reorderedUser._id})
    .then((res)=>{
      setTrigger(!trigger);
    })
    .catch((err)=>{
      setTrigger(!trigger);
    })

    setUserList(updatedUserList);
  };

  return (
    <div className="bg-white text-black h-screen dark:text-white dark:bg-gray-900 px-20 mt-3">
      <p className="text-center font-bold">Waiting List Queue</p>

      <p className="text-center font-light text-sm">Disclaimer : Drag and drop the items to move the position</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="user-list">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {userList?.map((user, index) => (
                <Draggable key={user._id} draggableId={user._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-blue-gray-800 my-3 p-2 text-center rounded shadow-md"
                    >
                      name: {user.name}, email : {user.email}, position :{" "}
                      {user.position}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default AdminInterface;
