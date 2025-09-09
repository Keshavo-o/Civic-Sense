const Report = require("../models/report");
const { findByIdAndUpdate } = require("../models/user");
const { getuser } = require("../services/auth");

// Handle comment submission
async function handlelike(req, res) {
    // console.log("like route hit");
    const postId = req.params.post_id;
    // console.log("Post ID:", postId);
    await Report.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
    console.log(req.query.t);
    if(req.query.t == 1){
      return res.redirect("/user");
    }
  return res.redirect(`/posts/${postId}`);
}

module.exports = { handlelike };
