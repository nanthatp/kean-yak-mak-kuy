package controller

import (
	"net/http"

	"github.com/JRKs1532/sa-65-example/entity"
	"github.com/gin-gonic/gin"
)

// POST /stocks
func CreateStock(c *gin.Context) {

	var stock entity.Stock
	var product entity.Product
	var lot entity.Lot
	var shelfproduct entity.Shelfproduct
	var employee entity.Employee

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 9 จะถูก bind เข้าตัวแปร stock
	if err := c.ShouldBindJSON(&stock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา product ด้วย id
	if tx := entity.DB().Where("id = ?", stock.ProductID).First(&product); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}

	// 10: ค้นหา lot ด้วย id
	if tx := entity.DB().Where("id = ?", stock.LotID).First(&lot); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "lot not found"})
		return
	}

	// 11: ค้นหา shelfproduct ด้วย id
	if tx := entity.DB().Where("id = ?", stock.ShelfproductID).First(&shelfproduct); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shelfproduct not found"})
		return
	}

	// 12: ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", stock.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	// 13: สร้าง Stock
	wv := entity.Stock{
		Product:        product,              //โยงความสัมพันธ์กับ Entity product
		Stock_quantity: stock.Stock_quantity, // ตั้งค่าฟิลด์ Stock Quantity
		Lot:            lot,                  // โยงความสัมพันธ์กับ Entity Lot
		Shelfproduct:   shelfproduct,         // โยงความสัมพันธ์กับ Entity Shelfproduct
		Employee:       employee,             // โยงความสัมพันธ์กับ Entity Employee
	}

	// 14: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": wv})
}

// GET /stock/:id
func GetStock(c *gin.Context) {
	var stock entity.Stock
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&stock); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "stock not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": stock})
}

// GET /stocks
func ListStocks(c *gin.Context) {
	var stocks []entity.Stock
	if err := entity.DB().Preload("Product").Preload("Lot").Preload("Shelfproduct").Preload("Employee").Raw("SELECT * FROM stocks").Find(&stocks).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": stocks})
}

// DELETE stocks/:id
func DeleteStock(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM stocks WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "stock not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /stocks
func UpdateStock(c *gin.Context) {
	var stock entity.Stock
	if err := c.ShouldBindJSON(&stock); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", stock.ID).First(&stock); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "stock not found"})
		return
	}

	if err := entity.DB().Save(&stock).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": stock})
}
