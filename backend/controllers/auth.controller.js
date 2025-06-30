const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const BlacklistTokenModel = require('../models/blacklisttoken.model.js');

exports.register = async (req, res) => {
  try {
    // const userFind = await User.findOne({email:req.body?.email});
    // if(userFind){
    //      return res.status(400).json({message:"User already exist"});
    // }
    await User.create(req.body);
    res.status(201).json({ message: 'User registered',status:201 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit User API
exports.editUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { email, name, password } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email is already in use by another user' });
        }
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      await user.save();
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  exports.getUser = async(req,res)=>{
      try{
              const result = await User.find();
              return res.status(201).json({result})
         
      }catch(err){
          res.status(400).json({error:err.message})
      }
  }

exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.params; 
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role },status:201 });
};

exports.logout = async (req, res, next) => {
    console.log("testindjdffnsdsjfkjsdhfjjsdre",req.user)
    const token =  req.headers.authorization?.split(' ')[1];
    console.log(token,"token")
    await BlacklistTokenModel.create({ token });

    res.status(200).json({ message: 'Logout successfully' });
}
