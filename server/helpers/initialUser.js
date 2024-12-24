import { User } from "../database.js";
import env from "../envConfig.js";
import serv from "../modules/users/controllerService.js";

const initialUser = async () => {
  const data = {
  email : env.user,
  password : env.pass,
  role : 9,
  picture : env.image,
  };
  try {
    const users = await User.findAll();
    if (users.length > 0) {
      return console.log("The user already exists!");
    }
    const superUser = await serv.userService.create(data, 'email', null);
    if (!superUser) {
      const error = error;
      error.status = 500;
      throw error;
    }
    return console.log("The user was successfully created!!");
  } catch (error) {
    console.error("Algo ocurrió al inicio: ", error);
  }
};
export default initialUser;

