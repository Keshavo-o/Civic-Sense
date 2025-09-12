const Report = require('../models/report.js');
const User = require('../models/user.js');
const { getuser } = require('../services/auth.js');
async function handle_explore(req, res) {
try {
  const token = req.cookies.token;
  const temp_user = getuser(token);
  const myuser = await User.findById(temp_user.id);

  // Get search query (?search=anything)
  const searchQuery = req.query.search ? req.query.search.trim() : "";

  let query = {};

  if (searchQuery) {
    // Get all schema paths of Report model except _id
    const paths = Object.keys(Report.schema.paths).filter(
      (p) => p !== "_id" && Report.schema.paths[p].instance === "String"
    );

    // Build $or query for all string fields
    query = {
      $or: paths.map((field) => ({
        [field]: { $regex: searchQuery, $options: "i" },
      })),
    };
  }

  // Fetch posts with optional search filter
  const posts = await Report.find(query)
    .populate("user", "username")
    .sort({ createdAt: -1 })
    .limit(30);

  // Top issues (always trending globally, not search filtered)
  const top_issues = await Report.find()
    .populate("user", "username")
    .sort({ likes: -1 })
    .limit(3);

  res.render("user_explore.ejs", {
    user: myuser,
    posts: posts,
    topPosts: top_issues,
    searchQuery,
  });

} catch (err) {
  console.error(err);
  res.status(500).send("Server error");
}

}
module.exports = { handle_explore }; 