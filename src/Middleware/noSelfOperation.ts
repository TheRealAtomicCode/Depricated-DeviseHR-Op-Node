const noSelfOperation = (myId: number, userId: number) => {
  if (myId === userId)
    throw new Error(
      'operation can not be performed on your own profile'
    );
};

export default noSelfOperation;
