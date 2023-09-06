/* eslint-disable no-unused-vars */
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

    PostAnyApi("admin/update", {
      newPosition: userList[newPosition - 1].position,
      userId: reorderedUser._id,
    })
      .then((res) => {
        setTrigger(!trigger);
      })
      .catch((err) => {
        setTrigger(!trigger);
      });

    setUserList(updatedUserList);
  };

  const handleDelete = (id)=>{
    getWithoutAuth(`admin/delete?refId=${id}`).then((res)=>{
      setTrigger(!trigger);
  })
  }

  return (
    <div className="bg-white text-black h-screen dark:text-white dark:bg-gray-900 px-20 mt-3">
      <p className="text-center font-bold">Waiting List Queue</p>

      <p className="text-center font-light text-sm">
        Disclaimer : Drag and drop the items to move the position
      </p>
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
                      className="bg-blue-gray-800 my-3 p-2 flex items-center justify-center text-center rounded shadow-md"
                    >
                      name: {user.name}, email : {user.email}, position :{" "}
                      {user.position}
                      <button className="mx-5 flex" onClick={()=>handleDelete(user._id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>Delete
                      </button>
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
