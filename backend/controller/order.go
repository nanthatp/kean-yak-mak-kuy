package controller

import (
	"net/http"

	"github.com/JRKs1532/sa-65-example/entity"
	"github.com/gin-gonic/gin"
)

// POST /orders
func CreateOrder(c *gin.Context) {

	var order entity.Order
	var product entity.Product
	var cart entity.Cart
	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร watchVideo
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา product ด้วย id
	if tx := entity.DB().Where("id = ?", order.ProductID).First(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "product not found"})
		return
	}

	// 10: ค้นหา cart ด้วย id
	if tx := entity.DB().Where("id = ?", order.CartID).First(&cart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cart not found"})
		return
	}

	// 12: สร้าง Cart
	od := entity.Order{
		Product:          product, // โยงความสัมพันธ์กับ Entity Resolution
		Product_quantity: order.Product_quantity,
		Cart:             cart, // โยงความสัมพันธ์กับ Entity Video // ตั้งค่าฟิลด์ watchedTime
	}

	// 13: บันทึก
	if err := entity.DB().Create(&od).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": od})
}

// GET /order/:id
func GetOrder(c *gin.Context) {
	var order entity.Order
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET /orders
func ListOrders(c *gin.Context) {
	var carts []entity.Cart
	if err := entity.DB().Preload("Product").Preload("Cart").Raw("SELECT * FROM orders").Find(&carts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": carts})
}

// DELETE /orders/:id
// func DeleteOrder(c *gin.Context) {
// 	id := c.Param("id")
// 	if tx := entity.DB().Exec("DELETE FROM orders WHERE id = ?", id); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": id})
// }

// PATCH /orders
// func UpdateOrder(c *gin.Context) {
// 	var order entity.Order
// 	if err := c.ShouldBindJSON(&order); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if tx := entity.DB().Where("id = ?", order.ID).First(&order); tx.RowsAffected == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
// 		return
// 	}

// 	if err := entity.DB().Save(&order).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": order})
// }
