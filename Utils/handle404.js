export const handle404 = (req, res) => {
    return res.status(404).json({ message: "404. Route not found" });
};