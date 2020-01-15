const buildReverseStack = (creationFn, initalLength = 0) => {
  const stack = Array.from({ length: initalLength }, () => creationFn());
  let index = 0;

  return {
    push: () => index -= 1,
    pop: () => {
      if (!stack[index]) {
        stack[index] = creationFn();
      }
      index += 1;
      return stack[index - 1];
    },
  };
};

export default buildReverseStack;
