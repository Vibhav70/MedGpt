exports.purchaseCredits = async (req, res) => {
    try {
      const { customer_id, amount } = req.body;
  
      if (!customer_id || !amount) {
        return res.status(400).json({ success: false, message: "Customer ID and amount are required" });
      }
  
      // Calculate credits based on amount (20 credits for 100 rupees)
      const creditsToAdd = (amount / 100) * 20;
  
      // Update user's credits
      const user = await User.findOne({ customer_id });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      user.credits += creditsToAdd;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Credits purchased successfully",
        data: { credits: user.credits },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
  