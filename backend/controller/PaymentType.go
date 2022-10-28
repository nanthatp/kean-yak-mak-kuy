package controller

import (
	"net/http"

	"github.com/JRKs1532/sa-65-example/entity"
	"github.com/gin-gonic/gin"
)

// POST /paymenttypes
func CreatePaymenttype(c *gin.Context) {
	var paymenttype entity.Paymenttype
	if err := c.ShouldBindJSON(&paymenttype); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&paymenttype).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": paymenttype})
}

// GET /paymenttype/:id
func GetPaymenttype(c *gin.Context) {
	var paymenttype entity.Paymenttype
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&paymenttype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymenttype not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymenttype})
}

// GET /paymenttypes
func ListPaymenttypes(c *gin.Context) {
	var paymenttypes []entity.Paymenttype
	if err := entity.DB().Raw("SELECT * FROM paymenttypes").Scan(&paymenttypes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymenttypes})
}

// DELETE /paymenttypes/:id
func DeletePaymenttype(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM paymenttypes WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymenttype not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /paymenttypes
func UpdatePaymenttype(c *gin.Context) {
	var paymenttype entity.Paymenttype
	if err := c.ShouldBindJSON(&paymenttype); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", paymenttype.ID).First(&paymenttype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymenttype not found"})
		return
	}

	if err := entity.DB().Save(&paymenttype).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymenttype})
}
