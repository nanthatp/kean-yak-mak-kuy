package controller

import (
	"net/http"

	"github.com/JRKs1532/sa-65-example/entity"
	"github.com/gin-gonic/gin"
)

// POST /receipts
func CreateReceipt(c *gin.Context) {

	var receipt entity.Receipt
	var paymenttype entity.Paymenttype
	var cart entity.Cart
	var employee entity.Employee
	var member entity.Member

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร receipt
	if err := c.ShouldBindJSON(&receipt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา paymenttype ด้วย id
	if tx := entity.DB().Where("id = ?", receipt.PaymenttypeID).First(&paymenttype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymenttype not found"})
		return
	}

	// 10: ค้นหา cart ด้วย id
	if tx := entity.DB().Where("id = ?", receipt.CartID).First(&cart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cart not found"})
		return
	}

	// 11: ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", receipt.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	// 12: ค้นหา member ด้วย id
	if tx := entity.DB().Where("id = ?", receipt.MemberID).First(&member); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "member not found"})
		return
	}

	// 13: สร้าง Receipt
	wv := entity.Receipt{
		ReceiptTime:          receipt.ReceiptTime,          // ตั้งค่าฟิลด์ ReceiptTime
		ReceiptSum:           receipt.ReceiptSum,           // ตั้งค่าฟิลด์ ReceiptSum
		ReceiptPaymentAmount: receipt.ReceiptPaymentAmount, // ตั้งค่าฟิลด์ ReceiptPaymentAmount
		Paymenttype:          paymenttype,                  //โยงความสัมพันธ์กับ Entity Paymenttype
		Cart:                 cart,                         // โยงความสัมพันธ์กับ Entity Cart
		Employee:             employee,                     // โยงความสัมพันธ์กับ Entity Employee
		Member:               member,                       // โยงความสัมพันธ์กับ Entity Member

	}

	// 14: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": wv})
}

// GET /receipt/:id
func GetReceipt(c *gin.Context) {
	var receipt entity.Receipt
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&receipt); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "receipt not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": receipt})
}

// GET /receipts (ดึงข้อมูลทั้งหมดของ receipt)
func ListReceipts(c *gin.Context) {
	var receipts []entity.Receipt
	if err := entity.DB().Preload("Paymenttype").Preload("Cart").Preload("Employee").Preload("Member").Raw("SELECT * FROM receipts").Find(&receipts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receipts})
}

// DELETE receipts/:id
func DeleteReceipt(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM receipts WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "receipt not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /receipts
func UpdateReceipt(c *gin.Context) {
	var receipt entity.Receipt
	if err := c.ShouldBindJSON(&receipt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", receipt.ID).First(&receipt); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "receipt not found"})
		return
	}

	if err := entity.DB().Save(&receipt).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": receipt})
}
