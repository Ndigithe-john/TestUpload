const supabase = require("../config/supabaseClient");
async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      throw error;
    }
    if (data.length === 0) {
      throw new Error("User Not Found");
    }
    return data[0];
  } catch (error) {
    console.error("Error fetching user by email:", error.message);
    return null;
  }
}
module.exports = getUserByEmail;
