import "./RoomInput.css";

function RoomInput({ handleRoomConnection }) {
  return (
    <div className="formContainer">
      <form onSubmit={handleRoomConnection}>
        <input
          placeholder="Room ID"
          type="text"
          className="form-control"
          id="room-input"
        />
        <div className="buttonDiv">
          <input
            value="Join"
            type="submit"
            className="btn btn-outline-primary"
            id="join-btn"
          />
          <input
            value="Leave"
            type="submit"
            className="btn btn-outline-danger"
            id="leave-btn"
          />
        </div>
      </form>
    </div>
  );
}

export default RoomInput;
