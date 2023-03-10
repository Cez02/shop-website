const  express =  require("express");
const router = express.Router();
const upload = require("../model/LocalStorage")

const ItemController = require("../controllers/ItemController")

router.get("/add", ItemController.getAllItems);
router.get("/:item_id", ItemController.getItemById);

router.post("/add", upload.single('image'), ItemController.addItem);
router.post("/:item_id", ItemController.saveItemToCart);

module.exports = router;
