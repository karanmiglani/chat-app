export const getSender = (loggedUser, users) => {
    if (users && users.length >= 2) {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    } else {
        // Handle the case where users is undefined or doesn't have enough elements
        return "Unknown Sender";
    }
}


export const getFullSender = (loggedUser , users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

export const isSamesender = (messages , msg, i ,userId) => {
    
    let result =     i < messages.length - 1 && 
        (messages[i+1].sender._id !== msg.sender._id ||
            messages[i+1].sender._id === undefined) && messages[i].sender._id !== userId;           
    return result;
    
}

export const isLastMessage = (messages , i , userId) => {
    return (
        i === messages.length - 1 && 
        messages[messages.length - 1].sender._id !== userId && 
        messages[messages.length - 1].sender._id
    );
}


export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };

export const isSameUser = (messges , m ,i) => {
    return i > 0 && messges[i-1].sender._id === m.sender._id  
}