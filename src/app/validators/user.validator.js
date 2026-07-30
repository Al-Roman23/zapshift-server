// Validator Helper For User Input Validation
function validateRegisterUser(data) {
  const { name, email, role } = data;

  // Check Required Fields
  if (!name || !email) {
    return {
      valid: false,
      message: "Name And Email Are Required!",
    };
  }

  // Validate Email Format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid Email Format!" };
  }

  // Validate Role (If Provided)
  const allowedRoles = ["buyer", "manager", "user"];
  if (role && !allowedRoles.includes(role)) {
    return { valid: false, message: "Role Must Be Buyer Or Manager or User!" };
  }

  // Return Valid If All Checks Pass
  return { valid: true };
}

module.exports = { validateRegisterUser };
