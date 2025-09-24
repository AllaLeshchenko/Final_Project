import User from '../models/userModel.js';


// Получение профиля по ID
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // ищем пользователя и исключаем пароль
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Обновление профиля (имя, био, аватар)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // берём userId из токена (protect middleware)
    const { fullName, bio } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;

    // Если загружен файл (multer кладёт его в req.file)
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      updateData.profileImage = base64Image;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // возвращает обновлённого пользователя
    }).select("-password"); // исключаем пароль

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

