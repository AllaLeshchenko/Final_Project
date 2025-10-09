import User from '../models/userModel.js';

// Получение профиля по ID
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .select("-password -email") // убираем пароль и email
      .populate("posts")
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // преобразуем followers/following → массив пользователей
    const followersUsers = user.followers?.map(f => f.follower);
    const followingUsers = user.following?.map(f => f.following);

    res.json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      bio: user.bio,
      profileImage: user.profileImage,
      postsCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      posts: user.posts,
      followers: followersUsers,
      following: followingUsers,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Обновление профиля (имя, био, аватар)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // берём userId из токена (protect middleware)

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

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
      new: true,                   // вернуть обновлённого пользователя
    }).select("-password -email"); // убираем пароль и email

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Получение данных текущего пользователя
// export const getCurrentUser = async (req, res) => {
//   try {
//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const user = await User.findById(userId)
//       .select("-password -email");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Get current user error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
