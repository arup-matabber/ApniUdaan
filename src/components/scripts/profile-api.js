// API route handler for profile form submission
// This would typically be in your backend/API folder

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const formData = req.body

  console.log("[v0] Profile Form Data Received (200 OK):")
  console.log(JSON.stringify(formData, null, 2))

  // Return success response
  return res.status(200).json({
    status: 200,
    message: "Profile form data received successfully",
    data: formData,
  })
}
