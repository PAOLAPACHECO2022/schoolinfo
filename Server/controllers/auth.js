import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Grade from "../models/Grade.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

//REGISTER USER
export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: "Admin",
      picturePath: req.file ? req.file.filename : "",
    });
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dni,
      password,
      phone,
      fechaNacimiento,
      nacionality,
      gradeId,
    } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const grade = await Grade.findById(gradeId);
    const newStudent = new Student({
      firstName,
      lastName,
      dni,
      password: passwordHash,
      role: "Student",
      phone,
      fechaNacimiento,
      nacionality,
      gradeId,
      gradeName: grade.gradeName,
    });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const registerTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, area } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: "Teacher",
      phone,      
      area,
    });
    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// LOGIN USER
export const login = async (req, res) => {
  try {
    const { typeUser } = req.body;
    let user;

    if (typeUser == "Teacher") {
      const { email, password } = req.body;
      user = await Teacher.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User doesn't exist." });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials." });
    } else if (typeUser == "Admin") {
      const { email, password } = req.body;
      user = await Admin.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User doesn't exist." });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials." });
    } else {
      const { dni, password } = req.body;
      user = await Student.findOne({ dni: dni });
      if (!user) return res.status(400).json({ msg: "User doesn't exist." });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
