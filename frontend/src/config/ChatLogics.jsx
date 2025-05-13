export const getSender = (loggedUser, users) => {
  if (!Array.isArray(users) || users.length < 2) {
    throw new Error("Invalid users array");
  }
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getSenderUser = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
}

export const isSameSender = (messages, m, i, userId) => {
  return(
    i < messages.lenght - 1 &&
    (messages [i+1].sender._id !== messages[i].sender._id ||
    messages[i].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );

}



export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
}
