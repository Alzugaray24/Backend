import userModel from "../models/users.model.js";

class UserDao {
  async createUser(user) {
    try {
      const newUser = await userModel.create(user);
      return newUser;
    } catch (error) {
      console.error("Error al crear usuario en el DAO:", error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email });
      return user;
    } catch (error) {
      console.error("Error al buscar usuario por email en el DAO:", error);
      throw error;
    }
  }

  async updateUser(id, newData) {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(id, newData, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      console.error("Error al actualizar usuario en el DAO:", error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await userModel.findByIdAndDelete(id);
    } catch (error) {
      console.error("Error al eliminar usuario en el DAO:", error);
      throw error;
    }
  }
}

export default UserDao;
