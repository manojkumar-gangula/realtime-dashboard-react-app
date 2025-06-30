import "./RoomInput.css";

function RoomInput({ handleRoomConnection, inputRef }) {
  return (
    <div className="formContainer">
      <form onSubmit={handleRoomConnection}>
        <input
          placeholder="Room ID"
          type="text"
          className="form-control"
          id="room-input"
          ref={inputRef}
        />
        <div className="buttonDiv">
          <input
            value="Join"
            type="submit"
            className="btn btn-primary"
            id="join-btn"
          />
          <input
            value="Leave"
            type="submit"
            className="btn btn-danger"
            id="leave-btn"
          />
        </div>
      </form>
    </div>
  );
}

export default RoomInput;
