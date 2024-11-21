import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const port: number = parseInt(PORT as string);

app.listen(port, "0.0.0.0", () => {
	console.log(`Server is running on port :${port}`);
});
