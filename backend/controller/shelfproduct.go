package controller

import (
	"net/http"

	"github.com/JRKs1532/sa-65-example/entity"
	"github.com/gin-gonic/gin"
)

// POST /helfproducts
func CreateShelfproduct(c *gin.Context) {
	var shelfproduct entity.Shelfproduct
	if err := c.ShouldBindJSON(&shelfproduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&shelfproduct).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": shelfproduct})
}

// GET /shelfproduct/:id
func GetShelfproduct(c *gin.Context) {
	var shelfproduct entity.Shelfproduct
	id := c.Param("id")
	if tx := entity.DB().Where("id = ?", id).First(&shelfproduct); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shelfproduct not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": shelfproduct})
}

// GET /shelfproducts
func ListShelfproducts(c *gin.Context) {
	var shelfproducts []entity.Shelfproduct
	if err := entity.DB().Raw("SELECT * FROM shelfproducts").Scan(&shelfproducts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": shelfproducts})
}

// DELETE /shelfproducts/:id
func DeleteShelfproduct(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM shelfproducts WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shelfproduct not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /shelfproducts
func UpdateShelfproduct(c *gin.Context) {
	var shelfproduct entity.Shelfproduct
	if err := c.ShouldBindJSON(&shelfproduct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", shelfproduct.ID).First(&shelfproduct); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymenttype not found"})
		return
	}

	if err := entity.DB().Save(&shelfproduct).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": shelfproduct})
}
