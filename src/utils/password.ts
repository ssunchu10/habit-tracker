import bcrypt from "bcryptjs";

const saltAndHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (password : string, hashedPassword : string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export {saltAndHashPassword, comparePassword};