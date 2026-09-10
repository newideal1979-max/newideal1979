// req.user is already loaded (and auto-created on first request) by the requireAuth
// middleware, so /me just returns the trusted profile.
export async function getMe(req, res) {
  res.json({ success: true, message: "Current user.", data: req.user });
}

export async function updateMyProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    req.user.name = name ?? req.user.name;
    req.user.phone = phone ?? req.user.phone;
    await req.user.save();
    res.json({ success: true, message: "Profile updated.", data: req.user });
  } catch (err) {
    next(err);
  }
}
