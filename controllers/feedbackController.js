// /controllers/feedbackController.js
export const submitFeedback = (req, res) => {
    const { rating, selectedOptions, review } = req.body;
    console.log("Received feedback:", { rating, selectedOptions, review });
    res.send({ message: "Feedback submitted successfully" });
  };
  