export const validateSignup = (data) => {
    const { name_surname, username, password } = data;
    if (!name_surname || !username || !password) {
      return false;
    }
    return true;
  };
  