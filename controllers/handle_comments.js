const Report = require("../models/report");
const { getuser } = require("../services/auth");

// Handle comment submission
async function handlecomments(req, res) {
  try {
    const token = req.cookies.token;
    const user = getuser(token); // decoded user from JWT
    if(!token)
    {
      res.redirect(`/posts/${req.params.post_id}`);
    }

    if (!user) {
      return res.status(401).send("Unauthorized. Please log in first.");
    }

    const report = await Report.findById(req.params.post_id);
    if (!report) {
      return res.status(404).send("Post not found");
    }
    // console.log(user);

    // Push new comment with user ObjectId
    report.comments.push({
      text: req.body.comment,
      user: user.id ,// store ObjectId
      name : user.name
    });

    await report.save();

    res.redirect(`/posts/${req.params.post_id}`);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).send("Internal server error");
  }
}

module.exports = { handlecomments };
