export const getSender = (loggedUser, users) => {
  if (!Array.isArray(users) || users.length < 2) {
    throw new Error("Invalid users array");
  }
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}

export const getSenderUser = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0].pic;
}