const defaultName = "Mr. X";

const doubleIt = val =>  val * 2;

const formatGreeting = (greeting, name, forcefully) => {
  const recipient  = name ? name : defaultName;
  const str = `${greeting} ${recipient}`;
  return forcefully ? `${str.toUpperCase()}!` : str;
};

export { defaultName, doubleIt, formatGreeting, temp};