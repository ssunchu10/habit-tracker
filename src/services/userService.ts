import { connectDB } from "../lib/connectDB";
import { IUser, User } from "../models/User";
import { comparePassword } from "../utils/password";

interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
}

export class UserService {
  async createUser(newUserData: CreateUserInput): Promise<IUser> {
    try {
      await connectDB();
      const newUser = new User(newUserData);
      return await newUser.save();
    } catch (error) {
      console.error("User creation error:", error);
      throw new Error("Failed to create user");
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      await connectDB();
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error("User lookup error:", error);
      throw new Error("Failed to find user");
    }
  }

  async findUserByCredentials(email: string, password: string): Promise<IUser> {
    try {
      await connectDB();
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`Invalid email or password`);
      }

      const isValid = await comparePassword(password, user.password_hash);

      if (!isValid) {
        throw new Error("Invalid email or password");
      }
      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication failed");
    }
  }

  async findUserByID(id: string): Promise<IUser> {
    try {
      await connectDB();
      const user = await User.findOne({ id });
      if (!user) {
        throw new Error(`User not found`);
      }
      return user;
    } catch (error) {
      console.error("User lookup error:", error);
      throw new Error("Failed to find user");
    }
  }
}
